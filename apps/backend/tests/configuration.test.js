const request = require('supertest');
const express = require('express');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const configRouter = require('../src/features/configuration/routes');
const SystemConfig = require('../src/features/configuration/model');
const errorHandler = require('../src/middleware/errorHandler');

const JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use(cookieParser());
  app.use('/config', configRouter);
  app.use(errorHandler);
  return app;
}

function signCookie(payload) {
  const token = jwt.sign(payload, JWT_SECRET);
  return `ecocollect_token=${token}`;
}

describe('Configuration API', () => {
  test('guards: 401 when missing token, 403 when role is USER, 200 for ADMIN', async () => {
    const app = buildApp();

    // 401 - no token
    let res = await request(app).get('/config');
    expect(res.status).toBe(401);

    // 403 - user token
    res = await request(app)
      .get('/config')
      .set('Cookie', signCookie({ id: 'user1', role: 'USER' }));
    expect(res.status).toBe(403);

    // 200 - admin token
    res = await request(app)
      .get('/config')
      .set('Cookie', signCookie({ id: 'admin1', role: 'ADMIN' }));
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id');
  });

  test('GET returns default document when none exists and PUT updates persisted config', async () => {
    const app = buildApp();

    // Ensure DB starts empty
    await SystemConfig.deleteMany({});

    // First GET should upsert an empty config
    let res = await request(app)
      .get('/config')
      .set('Cookie', signCookie({ id: 'admin1', role: 'ADMIN' }));
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(Array.isArray(res.body.billingModels || [])).toBe(true);
    expect(Array.isArray(res.body.wasteCategories || [])).toBe(true);

    // Update configuration
    const update = {
      billingModels: [{ name: 'weight', rate: 5 }],
      wasteCategories: [
        { key: 'plastic', label: 'Plastic' },
        { key: 'organic', label: 'Organic' },
      ],
    };
    res = await request(app)
      .put('/config')
      .send(update)
      .set('Cookie', signCookie({ id: 'admin1', role: 'ADMIN' }));
    expect(res.status).toBe(200);
    expect(res.body.billingModels[0]).toMatchObject({ name: 'weight', rate: 5 });
    expect(res.body.wasteCategories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'plastic', label: 'Plastic' }),
        expect.objectContaining({ key: 'organic', label: 'Organic' }),
      ])
    );

    // Subsequent GET should reflect the updated values
    res = await request(app)
      .get('/config')
      .set('Cookie', signCookie({ id: 'admin1', role: 'ADMIN' }));
    expect(res.status).toBe(200);
    expect(res.body.billingModels[0]).toMatchObject({ name: 'weight', rate: 5 });
    expect(res.body.wasteCategories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'plastic', label: 'Plastic' }),
        expect.objectContaining({ key: 'organic', label: 'Organic' }),
      ])
    );
  });

  test('DELETE removes configuration and subsequent GET recreates default', async () => {
    const app = buildApp();

    // Ensure there is a config
    let res = await request(app)
      .get('/config')
      .set('Cookie', signCookie({ id: 'admin1', role: 'ADMIN' }));
    expect(res.status).toBe(200);
    const id = res.body?._id;
    expect(id).toBeTruthy();

    // Delete configuration
    res = await request(app)
      .delete('/config')
      .set('Cookie', signCookie({ id: 'admin1', role: 'ADMIN' }));
    expect(res.status).toBe(204);

    // Next GET should recreate default config (new id likely)
    res = await request(app)
      .get('/config')
      .set('Cookie', signCookie({ id: 'admin1', role: 'ADMIN' }));
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('_id');
    expect(Array.isArray(res.body.billingModels || [])).toBe(true);
    expect(Array.isArray(res.body.wasteCategories || [])).toBe(true);
  });
});
