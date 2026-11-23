const img = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=70`;
export const seedProducts = [
  { name: "Kikoy Beach Wrap", category: "Fashion", price: 1200, description: "Soft cotton kikoy woven on the coast.", image: img("photo-1520975916090-3105956dac38") },
  { name: "Maasai Beaded Bracelet", category: "Accessories", price: 1, description: "Hand-beaded by artisans in Kajiado.", image: img("photo-1611591437281-460bfbe1220a") },
  { name: "Kiondo Basket Bag", category: "Bags", price: 2800, description: "Sisal and leather everyday shoulder bag.", image: img("photo-1590874103328-eac38a683ce7") },
  { name: "Wireless Earbuds", category: "Electronics", price: 3499, description: "20-hour battery, USB-C charging case.", image: img("photo-1590658268037-6bf12165a8df") },
  { name: "Smart Watch Fit", category: "Electronics", price: 5999, description: "Heart-rate, steps and sleep tracking.", image: img("photo-1523275335684-37898b6baf30") },
  { name: "Kenyan AA Coffee 500g", category: "Food", price: 950, description: "Medium roast, grown on Mt. Kenya slopes.", image: img("photo-1559056199-641a0ac8b55e") },
  { name: "Running Sneakers", category: "Fashion", price: 4500, description: "Lightweight, breathable, all-day comfort.", image: img("photo-1542291026-7eec264c27ff") },
  { name: "Soapstone Bowl", category: "Home", price: 1800, description: "Carved in Kisii, finished by hand.", image: img("photo-1578749556568-bc2c40e68b61") },
];
