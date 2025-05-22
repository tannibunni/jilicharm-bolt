-- Add sample products
INSERT INTO products (title, description, image_url, shopify_url, price, elements, themes) VALUES
(
  'Blue Crystal Water Fountain',
  'Enhance water energy in your home with this elegant crystal fountain',
  'https://images.pexels.com/photos/671956/pexels-photo-671956.jpeg',
  'https://example.com/product1',
  79.99,
  ARRAY['water'],
  ARRAY['wealth', 'career']
),
(
  'Jade Plant in Ceramic Pot',
  'Bring wood energy and prosperity with this beautiful jade plant',
  'https://images.pexels.com/photos/1005715/pexels-photo-1005715.jpeg',
  'https://example.com/product2',
  45.99,
  ARRAY['wood', 'earth'],
  ARRAY['wealth', 'health']
),
(
  'Rose Quartz Crystal Cluster',
  'Attract love and positive energy with this rose quartz crystal',
  'https://images.pexels.com/photos/6363791/pexels-photo-6363791.jpeg',
  'https://example.com/product3',
  29.99,
  ARRAY['fire', 'earth'],
  ARRAY['love', 'health']
),
(
  'Brass Wind Chimes',
  'Balance metal energy and attract positive chi with these wind chimes',
  'https://images.pexels.com/photos/3831826/pexels-photo-3831826.jpeg',
  'https://example.com/product4',
  29.99,
  ARRAY['metal'],
  ARRAY['career', 'wealth']
),
(
  'Red Candle Set',
  'Enhance fire energy and passion with these elegant red candles',
  'https://images.pexels.com/photos/3214975/pexels-photo-3214975.jpeg',
  'https://example.com/product5',
  15.99,
  ARRAY['fire'],
  ARRAY['love', 'career']
); 