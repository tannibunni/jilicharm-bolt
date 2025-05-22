-- Add more products to the products table
INSERT INTO products (title, description, image_url, shopify_url, price, elements, themes)
VALUES
  ('Crystal Water Fountain', 'Beautiful crystal water fountain that enhances water energy and creates a peaceful atmosphere', 'https://example.com/water-fountain.jpg', 'https://shopify.com/products/water-fountain', 79.99, ARRAY['water'], ARRAY['wealth', 'health']),
  
  ('Bamboo Wind Chime', 'Elegant bamboo wind chime that brings wood energy and positive vibrations', 'https://example.com/bamboo-chime.jpg', 'https://shopify.com/products/bamboo-chime', 45.99, ARRAY['wood'], ARRAY['wealth', 'luck']),
  
  ('Rose Quartz Crystal', 'Natural rose quartz crystal that attracts love and positive energy', 'https://example.com/rose-quartz.jpg', 'https://shopify.com/products/rose-quartz', 29.99, ARRAY['earth'], ARRAY['love', 'health']),
  
  ('Brass Wind Chimes', 'Traditional brass wind chimes that balance metal energy and create harmony', 'https://example.com/brass-chimes.jpg', 'https://shopify.com/products/brass-chimes', 59.99, ARRAY['metal'], ARRAY['wealth', 'luck']),
  
  ('Red Candle Set', 'Set of red candles that enhance fire energy and bring passion', 'https://example.com/red-candles.jpg', 'https://shopify.com/products/red-candles', 39.99, ARRAY['fire'], ARRAY['love', 'wealth']),
  
  ('Jade Plant', 'Lush jade plant that brings wood energy and prosperity', 'https://example.com/jade-plant.jpg', 'https://shopify.com/products/jade-plant', 49.99, ARRAY['wood'], ARRAY['wealth', 'health']),
  
  ('Crystal Geode', 'Natural crystal geode that enhances earth energy and stability', 'https://example.com/crystal-geode.jpg', 'https://shopify.com/products/crystal-geode', 89.99, ARRAY['earth'], ARRAY['wealth', 'health']),
  
  ('Copper Wind Spinner', 'Beautiful copper wind spinner that activates metal energy and brings good fortune', 'https://example.com/copper-spinner.jpg', 'https://shopify.com/products/copper-spinner', 69.99, ARRAY['metal'], ARRAY['wealth', 'luck']),
  
  ('Essential Oil Diffuser', 'Modern essential oil diffuser that combines water and wood energy', 'https://example.com/oil-diffuser.jpg', 'https://shopify.com/products/oil-diffuser', 79.99, ARRAY['water', 'wood'], ARRAY['health', 'wealth']),
  
  ('Crystal Grid Set', 'Complete crystal grid set that combines all five elements', 'https://example.com/crystal-grid.jpg', 'https://shopify.com/products/crystal-grid', 129.99, ARRAY['water', 'wood', 'fire', 'earth', 'metal'], ARRAY['wealth', 'health', 'love', 'luck']); 