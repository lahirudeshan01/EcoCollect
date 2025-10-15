const { Router } = require('express');

const router = Router();

// Feature subroutes
try { router.use('/auth', require('./auth/routes')); } catch {}
try { router.use('/users', require('./users/routes')); } catch {}
try { router.use('/configuration', require('./configuration/routes')); } catch {}
try { router.use('/routes', require('./routes/routes')); } catch {}
try { router.use('/accounts', require('./accounts/routes')); } catch {}
try { router.use('/collections', require('./collections/routes')); } catch {}
// try { router.use('/configuration', require('./configuration/routes')); } catch {}
// try { router.use('/routes', require('./routes/routes')); } catch {}
// try { router.use('/accounts', require('./accounts/routes')); } catch {}
// try { router.use('/collections', require('./collections/routes')); } catch {}

router.get('/', (_req, res) => res.json({ ok: true, scope: 'features' }));

module.exports = router;
