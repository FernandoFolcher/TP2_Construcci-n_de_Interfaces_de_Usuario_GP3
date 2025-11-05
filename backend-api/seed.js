const { sequelize, User, Post, Comment, Tag, PostImage } = require('./models');

async function seed() {
  await sequelize.sync({ force: true });

  // Crear usuarios
  const luna = await User.create({ nickName: 'luna', email: 'luna@example.com' });
  const sol = await User.create({ nickName: 'sol', email: 'sol@example.com' });
  const alex = await User.create({ nickName: 'alex', email: 'alex@example.com' });
  const emma = await User.create({ nickName: 'emma', email: 'emma@example.com' });
  const carlos = await User.create({ nickName: 'carlos', email: 'carlos@example.com' });
  const sofia = await User.create({ nickName: 'sofia', email: 'sofia@example.com' });

  // Crear etiquetas
  const tagArte = await Tag.create({ name: 'arte' });
  const tagUnahur = await Tag.create({ name: 'unahur' });
  const tagTecnologia = await Tag.create({ name: 'tecnologia' });
  const tagNaturaleza = await Tag.create({ name: 'naturaleza' });
  const tagFotografia = await Tag.create({ name: 'fotografia' });
  const tagReflexiones = await Tag.create({ name: 'reflexiones' });
  const tagViajes = await Tag.create({ name: 'viajes' });

  // Crear publicaciones con variedad de contenido
  const posts = [];

  posts.push(await Post.create({ 
    description: '🌅 Amanecer perfecto para reflexionar sobre la vida. A veces las mejores ideas llegan cuando menos las esperamos.', 
    UserId: luna.id 
  }));

  posts.push(await Post.create({ 
    description: 'Compartiendo mi proyecto final de la UNaHur 💻 Fue un desafío pero aprendí muchísimo!', 
    UserId: sol.id 
  }));

  posts.push(await Post.create({ 
    description: 'La naturaleza siempre me sorprende 🌿 Este lugar es increíble', 
    UserId: alex.id 
  }));

  posts.push(await Post.create({ 
    description: '☕ Momento café mientras codifico. React es amor ❤️', 
    UserId: emma.id 
  }));

  posts.push(await Post.create({ 
    description: 'Atardecer en la ciudad. La belleza está en los detalles 🌆', 
    UserId: carlos.id 
  }));

  posts.push(await Post.create({ 
    description: 'Sesión de fotos de hoy 📸 La luz estaba perfecta', 
    UserId: sofia.id 
  }));

  posts.push(await Post.create({ 
    description: 'Reflexiones nocturnas: El código más limpio es el que no necesitas escribir 💭', 
    UserId: luna.id 
  }));

  posts.push(await Post.create({ 
    description: '🎨 Nuevo proyecto de diseño en el que estoy trabajando. Pronto les muestro más!', 
    UserId: alex.id 
  }));

  posts.push(await Post.create({ 
    description: 'La arquitectura de esta ciudad es impresionante 🏛️', 
    UserId: emma.id 
  }));

  posts.push(await Post.create({ 
    description: 'Momento de desconexión. A veces hay que apagar todo y disfrutar 🧘‍♀️', 
    UserId: sofia.id 
  }));

  posts.push(await Post.create({ 
    description: 'Aprendiendo TypeScript y es increíble cómo mejora la productividad 🚀', 
    UserId: sol.id 
  }));

  posts.push(await Post.create({ 
    description: 'La naturaleza es la mejor artista 🌺', 
    UserId: carlos.id 
  }));

  // Asignar tags a posts
  await posts[0].setTags([tagReflexiones, tagNaturaleza]);
  await posts[1].setTags([tagUnahur, tagTecnologia]);
  await posts[2].setTags([tagNaturaleza, tagFotografia]);
  await posts[3].setTags([tagTecnologia, tagReflexiones]);
  await posts[4].setTags([tagFotografia, tagViajes]);
  await posts[5].setTags([tagFotografia, tagArte]);
  await posts[6].setTags([tagReflexiones, tagTecnologia]);
  await posts[7].setTags([tagArte, tagUnahur]);
  await posts[8].setTags([tagViajes, tagFotografia]);
  await posts[9].setTags([tagReflexiones]);
  await posts[10].setTags([tagTecnologia, tagUnahur]);
  await posts[11].setTags([tagNaturaleza, tagArte]);

  // Crear imágenes para los posts (usando picsum.photos)
  await PostImage.bulkCreate([
    // Post 0 - luna - amanecer
    { url: 'https://picsum.photos/seed/sunrise1/800/600', PostId: posts[0].id },
    
    // Post 1 - sol - proyecto
    { url: 'https://picsum.photos/seed/code1/800/600', PostId: posts[1].id },
    { url: 'https://picsum.photos/seed/code2/800/600', PostId: posts[1].id },
    
    // Post 2 - alex - naturaleza
    { url: 'https://picsum.photos/seed/nature1/800/600', PostId: posts[2].id },
    
    // Post 3 - emma - café
    { url: 'https://picsum.photos/seed/coffee1/800/600', PostId: posts[3].id },
    
    // Post 4 - carlos - atardecer
    { url: 'https://picsum.photos/seed/sunset1/800/600', PostId: posts[4].id },
    { url: 'https://picsum.photos/seed/sunset2/800/600', PostId: posts[4].id },
    
    // Post 5 - sofia - fotos
    { url: 'https://picsum.photos/seed/photo1/800/600', PostId: posts[5].id },
    { url: 'https://picsum.photos/seed/photo2/800/600', PostId: posts[5].id },
    { url: 'https://picsum.photos/seed/photo3/800/600', PostId: posts[5].id },
    
    // Post 7 - alex - diseño
    { url: 'https://picsum.photos/seed/design1/800/600', PostId: posts[7].id },
    
    // Post 8 - emma - arquitectura
    { url: 'https://picsum.photos/seed/architecture1/800/600', PostId: posts[8].id },
    { url: 'https://picsum.photos/seed/architecture2/800/600', PostId: posts[8].id },
    
    // Post 11 - carlos - naturaleza
    { url: 'https://picsum.photos/seed/flower1/800/600', PostId: posts[11].id },
  ]);

  // Crear comentarios variados
  await Comment.bulkCreate([
    { content: '¡Qué hermosa reflexión! 💭', UserId: sol.id, PostId: posts[0].id, visible: true },
    { content: 'Me encanta esta foto', UserId: alex.id, PostId: posts[0].id, visible: true },
    
    { content: 'Felicitaciones! Se ve increíble 🎉', UserId: luna.id, PostId: posts[1].id, visible: true },
    { content: 'Buen trabajo!', UserId: emma.id, PostId: posts[1].id, visible: true },
    { content: 'Inspirador 💪', UserId: carlos.id, PostId: posts[1].id, visible: true },
    
    { content: 'Wow! Dónde es esto?', UserId: sofia.id, PostId: posts[2].id, visible: true },
    { content: 'Hermoso lugar', UserId: luna.id, PostId: posts[2].id, visible: true },
    
    { content: 'El café del desarrollador ☕', UserId: sol.id, PostId: posts[3].id, visible: true },
    
    { content: 'Qué colores! 😍', UserId: alex.id, PostId: posts[4].id, visible: true },
    { content: 'Espectacular', UserId: emma.id, PostId: posts[4].id, visible: true },
    
    { content: 'Excelente trabajo fotográfico!', UserId: carlos.id, PostId: posts[5].id, visible: true },
    { content: 'Me encanta la composición', UserId: luna.id, PostId: posts[5].id, visible: true },
    
    { content: 'Totalmente de acuerdo 👏', UserId: sofia.id, PostId: posts[6].id, visible: true },
    
    { content: 'Qué ganas de ver el resultado!', UserId: sol.id, PostId: posts[7].id, visible: true },
    
    { content: 'Impresionante arquitectura', UserId: alex.id, PostId: posts[8].id, visible: true },
    
    { content: 'Necesito hacer lo mismo!', UserId: carlos.id, PostId: posts[9].id, visible: true },
    
    { content: 'TypeScript es lo mejor!', UserId: luna.id, PostId: posts[10].id, visible: true },
    { content: 'Estoy de acuerdo, cambió mi forma de programar', UserId: alex.id, PostId: posts[10].id, visible: true },
    
    { content: 'Hermosa fotografía 🌺', UserId: emma.id, PostId: posts[11].id, visible: true },
  ]);

  console.log('✅ Base de datos poblada exitosamente!');
  console.log('📊 Creados:');
  console.log('   - 6 usuarios');
  console.log('   - 12 publicaciones');
  console.log('   - 7 etiquetas');
  console.log('   - 14 imágenes');
  console.log('   - 19 comentarios');
  process.exit();
}

seed();
