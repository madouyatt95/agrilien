const urls = [
  { name: 'Miel_actuel', url: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=50' },
  { name: 'Miel_v2', url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=50' },
  { name: 'Miel_v3', url: 'https://images.unsplash.com/photo-1471943311424-646960669fbc?w=50' },
  { name: 'Miel_v4', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=50' },
  { name: 'Miel_v5', url: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?w=50' },
  { name: 'FarmerHat', url: 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=50' },
  { name: 'AfricanFarmer1', url: 'https://images.unsplash.com/photo-1589923158776-cb4485d99fd6?w=50' },
  { name: 'AfricanFarmer2', url: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=50' },
  { name: 'Farmer3', url: 'https://images.unsplash.com/photo-1605000797499-95a51c5269ae?w=50' },
  { name: 'Cassava', url: 'https://images.unsplash.com/photo-1603048297172-c92544798d5a?w=50' },
  { name: 'Ginger', url: 'https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=50' },
  { name: 'Bissap', url: 'https://images.unsplash.com/photo-1597481499750-3bc118732e27?w=50' },
  { name: 'Cashew', url: 'https://images.unsplash.com/photo-1563292769-4e05b684851a?w=50' },
  { name: 'BaobabFruit', url: 'https://images.unsplash.com/photo-1609151354405-57750a226af5?w=50' },
  { name: 'SweetPotato', url: 'https://images.unsplash.com/photo-1596097635092-6d8e3e5e3f29?w=50' },
  { name: 'Bananas', url: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=50' },
  { name: 'Peppers', url: 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=50' },
  { name: 'Eggs', url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=50' },
  { name: 'Fish', url: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?w=50' },
  { name: 'GoatMeat', url: 'https://images.unsplash.com/photo-1602470521006-aaea8b2d5ab9?w=50' },
];
(async () => {
  for (const item of urls) {
    try {
      const res = await fetch(item.url, { method: 'HEAD', redirect: 'follow' });
      console.log(`${item.name}: ${res.status}`);
    } catch (e) { console.log(`${item.name}: BROKEN`); }
  }
})();
