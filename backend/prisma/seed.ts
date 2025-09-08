import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test users
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@recolheja.com' },
    update: {},
    create: {
      name: 'Admin RecolheJá',
      email: 'admin@recolheja.com',
      passwordHash: await hash('123456', 8),
    },
  });

  const testUser = await prisma.user.upsert({
    where: { email: 'usuario@test.com' },
    update: {},
    create: {
      name: 'Usuário Teste',
      email: 'usuario@test.com',
      passwordHash: await hash('123456', 8),
    },
  });

  console.log('👥 Users created');

  // Create collection points
  const collectionPoints = [
    {
      name: 'Ecoponto Central',
      lat: -23.5505,
      lon: -46.6333,
      address: 'Av. Paulista, 1000 - São Paulo, SP',
      acceptedCategories: ['PLASTICO', 'PAPEL', 'METAL', 'VIDRO'],
      openingHours: 'Segunda a Sexta: 8h às 18h, Sábado: 8h às 12h',
      contact: '(11) 1234-5678',
      createdBy: adminUser.id,
    },
    {
      name: 'Coleta Eletrônicos Tech',
      lat: -23.5489,
      lon: -46.6388,
      address: 'Rua Augusta, 500 - São Paulo, SP',
      acceptedCategories: ['ELETRONICO'],
      openingHours: 'Segunda a Sexta: 9h às 17h',
      contact: '(11) 9876-5432',
      createdBy: adminUser.id,
    },
    {
      name: 'Compostagem Comunitária',
      lat: -23.5615,
      lon: -46.6562,
      address: 'Parque Ibirapuera - São Paulo, SP',
      acceptedCategories: ['ORGANICO'],
      openingHours: 'Todos os dias: 6h às 18h',
      contact: '(11) 5555-1234',
      createdBy: testUser.id,
    },
  ];

  for (const point of collectionPoints) {
    await prisma.collectionPoint.upsert({
      where: { id: 'placeholder' }, // Will not match, so always create
      update: {},
      create: point,
    });
  }

  console.log('📍 Collection points created');

  // Create events
  const futureDate1 = new Date();
  futureDate1.setDate(futureDate1.getDate() + 7); // 1 week from now

  const futureDate2 = new Date();
  futureDate2.setDate(futureDate2.getDate() + 14); // 2 weeks from now

  const events = [
    {
      title: 'Mutirão de Limpeza - Parque da Cidade',
      description: 'Venha participar do mutirão de limpeza do Parque da Cidade. Traga luvas e sacos de lixo. Café da manhã será oferecido para todos os participantes.',
      lat: -23.5505,
      lon: -46.6333,
      startAt: futureDate1,
      endAt: new Date(futureDate1.getTime() + 4 * 60 * 60 * 1000), // 4 hours later
      acceptedCategories: ['PLASTICO', 'PAPEL', 'METAL', 'ORGANICO'],
      createdBy: adminUser.id,
    },
    {
      title: 'Coleta de Eletrônicos Especial',
      description: 'Evento especial para coleta de equipamentos eletrônicos antigos. Traga seus aparelhos em desuso e contribua para o descarte correto.',
      lat: -23.5489,
      lon: -46.6388,
      startAt: futureDate2,
      endAt: new Date(futureDate2.getTime() + 6 * 60 * 60 * 1000), // 6 hours later
      acceptedCategories: ['ELETRONICO'],
      createdBy: testUser.id,
    },
  ];

  for (const event of events) {
    await prisma.event.create({
      data: event,
    });
  }

  console.log('📅 Events created');

  // Create some sample items
  const sampleItems = [
    {
      userId: testUser.id,
      imageUrl: 'sample-plastic-bottle.jpg',
      predictedCategory: 'PLASTICO',
      confidence: 0.95,
    },
    {
      userId: testUser.id,
      imageUrl: 'sample-paper.jpg',
      predictedCategory: 'PAPEL',
      confidence: 0.88,
    },
    {
      userId: null, // Anonymous submission
      imageUrl: 'sample-glass.jpg',
      predictedCategory: 'VIDRO',
      confidence: 0.92,
    },
  ];

  for (const item of sampleItems) {
    await prisma.item.create({
      data: item,
    });
  }

  console.log('📦 Sample items created');

  console.log('✅ Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
