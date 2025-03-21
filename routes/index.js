
import cryptoRoutes from './cryptos.js';
// import newsRoutes from './news.js';

const constructorMethod = (app) => {
  app.use('/cryptos', cryptoRoutes);
  // app.use('/news', newsRoutes);

  app.use('*', (req, res) => {
    return res.status(404).json({error: 'Not found'});
  });
};

export default constructorMethod;