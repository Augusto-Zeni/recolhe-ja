import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { User } from './users/entities/user.entity';
import { Category } from './categories/entities/category.entity';
import { CollectionPoint } from './collection-points/entities/collection-point.entity';
import { CollectionPointCategory } from './collection-points/entities/collection-point-category.entity';
import { Event } from './events/entities/event.entity';
import { EventCategory } from './events/entities/event-category.entity';
import * as bcrypt from 'bcrypt';

config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'user',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_DATABASE || 'recolheja_db',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
});

async function seed() {
  console.log('🌱 Iniciando seed do banco de dados...');

  try {
    await AppDataSource.initialize();
    console.log('✅ Conexão com banco de dados estabelecida');

    const userRepository = AppDataSource.getRepository(User);
    const categoryRepository = AppDataSource.getRepository(Category);
    const collectionPointRepository = AppDataSource.getRepository(CollectionPoint);
    const collectionPointCategoryRepository = AppDataSource.getRepository(CollectionPointCategory);
    const eventRepository = AppDataSource.getRepository(Event);
    const eventCategoryRepository = AppDataSource.getRepository(EventCategory);

    // Criar usuários de exemplo
    console.log('\n👤 Criando usuários...');
    const hashedPassword = await bcrypt.hash('senha123', 10);

    const users = [
      {
        name: 'João Silva',
        email: 'joao.silva@email.com',
        passwordHash: hashedPassword,
      },
      {
        name: 'Maria Santos',
        email: 'maria.santos@email.com',
        passwordHash: hashedPassword,
      },
      {
        name: 'Pedro Oliveira',
        email: 'pedro.oliveira@email.com',
        passwordHash: hashedPassword,
      },
    ];

    const savedUsers: User[] = [];
    for (const userData of users) {
      const existingUser = await userRepository.findOne({
        where: { email: userData.email },
      });
      if (!existingUser) {
        const user = userRepository.create(userData);
        const savedUser = await userRepository.save(user);
        savedUsers.push(savedUser);
        console.log(`  ✓ Usuário criado: ${savedUser.name}`);
      } else {
        savedUsers.push(existingUser);
        console.log(`  ℹ Usuário já existe: ${existingUser.name}`);
      }
    }

    // Criar categorias
    console.log('\n📦 Criando categorias...');
    const categoriesData = [
      { name: 'Plástico' },
      { name: 'Papel' },
      { name: 'Metal' },
      { name: 'Vidro' },
      { name: 'Orgânico' },
      { name: 'Eletrônicos' },
      { name: 'Pilhas e Baterias' },
      { name: 'Óleo de Cozinha' },
      { name: 'Roupas e Têxteis' },
      { name: 'Medicamentos' },
    ];

    const savedCategories: Category[] = [];
    for (const categoryData of categoriesData) {
      const existingCategory = await categoryRepository.findOne({
        where: { name: categoryData.name },
      });
      if (!existingCategory) {
        const category = categoryRepository.create(categoryData);
        const savedCategory = await categoryRepository.save(category);
        savedCategories.push(savedCategory);
        console.log(`  ✓ Categoria criada: ${savedCategory.name}`);
      } else {
        savedCategories.push(existingCategory);
        console.log(`  ℹ Categoria já existe: ${existingCategory.name}`);
      }
    }

    // Criar pontos de coleta
    console.log('\n📍 Criando pontos de coleta...');

    const collectionPointsData = [
      // Pontos originais de São Paulo
      {
        name: 'Ecoponto Centro SP',
        lat: -23.5505,
        lon: -46.6333,
        address: 'Rua XV de Novembro, 123 - Centro, São Paulo - SP',
        contact: '(11) 3333-4444',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },

      // VALE DO TAQUARI - RIO GRANDE DO SUL - BRASIL
      // Lajeado
      {
        name: 'EcoPonto Lajeado Centro',
        lat: -29.4669,
        lon: -51.9614,
        address: 'Rua Júlio de Castilhos, 1500 - Centro, Lajeado - RS',
        contact: '(51) 3714-1234',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'Recicla Univates',
        lat: -29.4531,
        lon: -51.9624,
        address: 'Av. Avelino Talini, 171 - Universitário, Lajeado - RS',
        contact: '(51) 3714-7000',
        openingHours: 'Segunda a Sábado: 7h às 19h',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 4, 5, 6],
      },
      {
        name: 'Ponto Verde Lajeado Shopping',
        lat: -29.4612,
        lon: -51.9701,
        address: 'Av. Benjamin Constant, 2340 - Centro, Lajeado - RS',
        contact: '(51) 3714-2500',
        openingHours: 'Segunda a Sábado: 10h às 22h',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 6, 7],
      },
      {
        name: 'EcoColeta Bairro São Cristóvão',
        lat: -29.4789,
        lon: -51.9532,
        address: 'Rua Duque de Caxias, 890 - São Cristóvão, Lajeado - RS',
        contact: '(51) 3714-3344',
        openingHours: 'Terça a Domingo: 8h às 17h',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'Recicla Moinhos',
        lat: -29.4723,
        lon: -51.9445,
        address: 'Rua dos Moinhos, 445 - Moinhos, Lajeado - RS',
        contact: '(51) 3714-5566',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 4],
      },
      {
        name: 'Ponto Sustentável Conventos',
        lat: -29.4598,
        lon: -51.9789,
        address: 'Rua Santo Antônio, 1120 - Conventos, Lajeado - RS',
        contact: '(51) 3714-6677',
        openingHours: 'Segunda a Sexta: 9h às 17h',
        userId: savedUsers[2].id,
        categories: [5, 6, 7, 8],
      },

      // Estrela
      {
        name: 'EcoPonto Estrela Centro',
        lat: -29.5032,
        lon: -51.9606,
        address: 'Rua Júlio de Castilhos, 800 - Centro, Estrela - RS',
        contact: '(51) 3730-1122',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'Recicla Estrela Industrial',
        lat: -29.5123,
        lon: -51.9689,
        address: 'Av. Industrial, 2340 - Industrial, Estrela - RS',
        contact: '(51) 3730-2233',
        openingHours: 'Segunda a Sábado: 7h às 19h',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 5, 6],
      },
      {
        name: 'Ponto Verde Bairro Operário',
        lat: -29.4989,
        lon: -51.9534,
        address: 'Rua Operária, 567 - Operário, Estrela - RS',
        contact: '(51) 3730-3344',
        openingHours: 'Segunda a Sexta: 8h às 17h',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 4],
      },

      // Teutônia
      {
        name: 'EcoPonto Teutônia Centro',
        lat: -29.4455,
        lon: -51.807,
        address: 'Rua Willy Ernesto Rech, 1200 - Centro, Teutônia - RS',
        contact: '(51) 3762-1234',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'Recicla Teutônia Langon',
        lat: -29.4389,
        lon: -51.8156,
        address: 'Rua Langon, 890 - Langon, Teutônia - RS',
        contact: '(51) 3762-2345',
        openingHours: 'Segunda a Sábado: 7h às 19h',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 5],
      },
      {
        name: 'Ponto Sustentável Canabarro',
        lat: -29.4512,
        lon: -51.8012,
        address: 'Rua Canabarro, 445 - Centro, Teutônia - RS',
        contact: '(51) 3762-3456',
        openingHours: 'Segunda a Sexta: 9h às 17h',
        userId: savedUsers[2].id,
        categories: [6, 7, 8, 9],
      },

      // Arroio do Meio
      {
        name: 'EcoPonto Arroio do Meio Centro',
        lat: -29.401,
        lon: -51.9434,
        address: 'Av. das Nações, 1100 - Centro, Arroio do Meio - RS',
        contact: '(51) 3716-1234',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'Recicla Arroio Shopping',
        lat: -29.4089,
        lon: -51.9523,
        address: 'Rua Pedro Senger, 2500 - Centro, Arroio do Meio - RS',
        contact: '(51) 3716-2345',
        openingHours: 'Segunda a Sábado: 10h às 22h',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 6],
      },
      {
        name: 'Ponto Verde Navegantes',
        lat: -29.3967,
        lon: -51.9378,
        address: 'Rua Navegantes, 780 - Navegantes, Arroio do Meio - RS',
        contact: '(51) 3716-3456',
        openingHours: 'Segunda a Sexta: 8h às 17h',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 4, 5],
      },

      // Encantado
      {
        name: 'EcoPonto Encantado Centro',
        lat: -29.2372,
        lon: -51.8688,
        address: 'Rua Borges de Medeiros, 900 - Centro, Encantado - RS',
        contact: '(51) 3751-1234',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'Recicla Encantado Sul',
        lat: -29.2456,
        lon: -51.8734,
        address: 'Av. Sul Brasil, 1500 - Centro, Encantado - RS',
        contact: '(51) 3751-2345',
        openingHours: 'Segunda a Sábado: 7h às 19h',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 5, 6],
      },
      {
        name: 'Ponto Sustentável Jacaré',
        lat: -29.2298,
        lon: -51.8612,
        address: 'Rua do Jacaré, 567 - Jacaré, Encantado - RS',
        contact: '(51) 3751-3456',
        openingHours: 'Segunda a Sexta: 9h às 17h',
        userId: savedUsers[2].id,
        categories: [7, 8, 9],
      },

      // Taquari
      {
        name: 'EcoPonto Taquari Centro',
        lat: -29.7975,
        lon: -51.8654,
        address: 'Rua Marechal Deodoro, 450 - Centro, Taquari - RS',
        contact: '(51) 3653-1234',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'Recicla Taquari Porto',
        lat: -29.8034,
        lon: -51.8712,
        address: 'Av. Beira Rio, 1200 - Porto, Taquari - RS',
        contact: '(51) 3653-2345',
        openingHours: 'Segunda a Sábado: 7h às 19h',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 4, 5],
      },

      // Cruzeiro do Sul
      {
        name: 'EcoPonto Cruzeiro do Sul',
        lat: -29.5143,
        lon: -51.9201,
        address: 'Rua Principal, 789 - Centro, Cruzeiro do Sul - RS',
        contact: '(51) 3748-1234',
        openingHours: 'Segunda a Sexta: 8h às 17h',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'Recicla Cruzeiro Industrial',
        lat: -29.5189,
        lon: -51.9267,
        address: 'Av. Industrial, 1500 - Industrial, Cruzeiro do Sul - RS',
        contact: '(51) 3748-2345',
        openingHours: 'Segunda a Sábado: 8h às 18h',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 5, 6],
      },

      // Roca Sales
      {
        name: 'EcoPonto Roca Sales Centro',
        lat: -29.2867,
        lon: -51.8678,
        address: 'Av. São José, 890 - Centro, Roca Sales - RS',
        contact: '(51) 3755-1234',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'Recicla Roca Sales Norte',
        lat: -29.2789,
        lon: -51.8734,
        address: 'Rua Norte, 567 - Norte, Roca Sales - RS',
        contact: '(51) 3755-2345',
        openingHours: 'Segunda a Sábado: 7h às 19h',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3, 4],
      },

      // Bom Retiro do Sul
      {
        name: 'EcoPonto Bom Retiro Centro',
        lat: -29.6089,
        lon: -51.9456,
        address: 'Rua Coberta, 1200 - Centro, Bom Retiro do Sul - RS',
        contact: '(51) 3785-1234',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3],
      },

      // Colinas
      {
        name: 'EcoPonto Colinas',
        lat: -29.4223,
        lon: -51.8456,
        address: 'Rua das Flores, 678 - Centro, Colinas - RS',
        contact: '(51) 3770-1234',
        openingHours: 'Segunda a Sexta: 8h às 17h',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3],
      },

      // SAN FRANCISCO - CALIFORNIA - USA
      // Downtown & Financial District
      {
        name: 'SF Recycle Center Downtown',
        lat: 37.7919,
        lon: -122.3972,
        address: '123 Market Street - Financial District, San Francisco - CA',
        contact: '+1 (415) 555-0101',
        openingHours: 'Monday to Friday: 7am to 7pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3, 5, 6],
      },
      {
        name: 'Green Point Financial District',
        lat: 37.7946,
        lon: -122.4015,
        address: '456 California Street - Financial District, San Francisco - CA',
        contact: '+1 (415) 555-0102',
        openingHours: 'Monday to Saturday: 8am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'EcoHub Embarcadero',
        lat: 37.7955,
        lon: -122.3937,
        address: '789 Embarcadero - Embarcadero, San Francisco - CA',
        contact: '+1 (415) 555-0103',
        openingHours: 'Every day: 6am to 8pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 4],
      },

      // Mission District
      {
        name: 'Mission Green Center',
        lat: 37.7599,
        lon: -122.4148,
        address: '234 Mission Street - Mission District, San Francisco - CA',
        contact: '+1 (415) 555-0104',
        openingHours: 'Monday to Friday: 8am to 6pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3, 5],
      },
      {
        name: 'Valencia Street Recycling',
        lat: 37.7645,
        lon: -122.4213,
        address: '567 Valencia Street - Mission District, San Francisco - CA',
        contact: '+1 (415) 555-0105',
        openingHours: 'Monday to Saturday: 9am to 7pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 6, 7],
      },
      {
        name: 'Mission Bay EcoStation',
        lat: 37.7703,
        lon: -122.3922,
        address: '890 Terry Francois Blvd - Mission Bay, San Francisco - CA',
        contact: '+1 (415) 555-0106',
        openingHours: 'Every day: 7am to 8pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 4, 5, 6],
      },

      // SOMA (South of Market)
      {
        name: 'SOMA Sustainability Center',
        lat: 37.7786,
        lon: -122.4056,
        address: '345 Folsom Street - SOMA, San Francisco - CA',
        contact: '+1 (415) 555-0107',
        openingHours: 'Monday to Friday: 7am to 7pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3, 5, 6],
      },
      {
        name: 'Recycle Hub 2nd Street',
        lat: 37.7823,
        lon: -122.3988,
        address: '678 2nd Street - SOMA, San Francisco - CA',
        contact: '+1 (415) 555-0108',
        openingHours: 'Monday to Saturday: 8am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'Green SOMA Recycling',
        lat: 37.7745,
        lon: -122.4102,
        address: '901 Howard Street - SOMA, San Francisco - CA',
        contact: '+1 (415) 555-0109',
        openingHours: 'Every day: 6am to 9pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 4, 5],
      },

      // Castro District
      {
        name: 'Castro EcoPoint',
        lat: 37.7609,
        lon: -122.435,
        address: '123 Castro Street - Castro, San Francisco - CA',
        contact: '+1 (415) 555-0110',
        openingHours: 'Monday to Saturday: 9am to 7pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3, 8],
      },
      {
        name: 'Rainbow Recycling Castro',
        lat: 37.7625,
        lon: -122.4378,
        address: '456 Market Street - Castro, San Francisco - CA',
        contact: '+1 (415) 555-0111',
        openingHours: 'Monday to Friday: 8am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 6, 7],
      },

      // Haight-Ashbury
      {
        name: 'Haight Street Green Center',
        lat: 37.7699,
        lon: -122.4469,
        address: '789 Haight Street - Haight-Ashbury, San Francisco - CA',
        contact: '+1 (415) 555-0112',
        openingHours: 'Monday to Saturday: 10am to 6pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 4, 8],
      },
      {
        name: 'Golden Gate Park Recycling',
        lat: 37.7694,
        lon: -122.4862,
        address: '234 Stanyan Street - Haight-Ashbury, San Francisco - CA',
        contact: '+1 (415) 555-0113',
        openingHours: 'Every day: 7am to 7pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3, 4],
      },

      // Richmond District
      {
        name: 'Richmond EcoCenter',
        lat: 37.7806,
        lon: -122.4656,
        address: '567 Geary Boulevard - Richmond, San Francisco - CA',
        contact: '+1 (415) 555-0114',
        openingHours: 'Monday to Friday: 8am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'Clement Street Recycling',
        lat: 37.7823,
        lon: -122.4712,
        address: '890 Clement Street - Richmond, San Francisco - CA',
        contact: '+1 (415) 555-0115',
        openingHours: 'Monday to Saturday: 9am to 7pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 5, 6],
      },
      {
        name: 'Ocean Beach Green Point',
        lat: 37.7645,
        lon: -122.5095,
        address: '123 Great Highway - Outer Richmond, San Francisco - CA',
        contact: '+1 (415) 555-0116',
        openingHours: 'Every day: 6am to 8pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3, 4],
      },

      // Sunset District
      {
        name: 'Sunset Sustainability Hub',
        lat: 37.7534,
        lon: -122.4856,
        address: '456 Taraval Street - Sunset, San Francisco - CA',
        contact: '+1 (415) 555-0117',
        openingHours: 'Monday to Saturday: 8am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 5],
      },
      {
        name: 'Irving Street EcoPoint',
        lat: 37.7634,
        lon: -122.4698,
        address: '789 Irving Street - Inner Sunset, San Francisco - CA',
        contact: '+1 (415) 555-0118',
        openingHours: 'Monday to Friday: 9am to 7pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 6, 7],
      },

      // Noe Valley
      {
        name: 'Noe Valley Green Center',
        lat: 37.7503,
        lon: -122.4312,
        address: '234 24th Street - Noe Valley, San Francisco - CA',
        contact: '+1 (415) 555-0119',
        openingHours: 'Monday to Saturday: 9am to 6pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3, 8],
      },

      // Pacific Heights
      {
        name: 'Pacific Heights Recycling',
        lat: 37.7923,
        lon: -122.4356,
        address: '567 Fillmore Street - Pacific Heights, San Francisco - CA',
        contact: '+1 (415) 555-0120',
        openingHours: 'Monday to Friday: 8am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'Union Street EcoHub',
        lat: 37.7978,
        lon: -122.4323,
        address: '890 Union Street - Pacific Heights, San Francisco - CA',
        contact: '+1 (415) 555-0121',
        openingHours: 'Monday to Saturday: 9am to 7pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 5, 6],
      },

      // North Beach
      {
        name: 'North Beach Green Point',
        lat: 37.8007,
        lon: -122.4089,
        address: '123 Columbus Avenue - North Beach, San Francisco - CA',
        contact: '+1 (415) 555-0122',
        openingHours: 'Every day: 7am to 8pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3, 4],
      },
      {
        name: 'Telegraph Hill Recycling',
        lat: 37.8023,
        lon: -122.4056,
        address: '456 Grant Avenue - North Beach, San Francisco - CA',
        contact: '+1 (415) 555-0123',
        openingHours: 'Monday to Saturday: 8am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 6, 7],
      },

      // Marina District
      {
        name: 'Marina Green EcoCenter',
        lat: 37.8045,
        lon: -122.4378,
        address: '789 Chestnut Street - Marina, San Francisco - CA',
        contact: '+1 (415) 555-0124',
        openingHours: 'Monday to Friday: 8am to 6pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 5],
      },
      {
        name: 'Fort Mason Recycling Hub',
        lat: 37.8067,
        lon: -122.4312,
        address: '234 Marina Boulevard - Marina, San Francisco - CA',
        contact: '+1 (415) 555-0125',
        openingHours: 'Every day: 6am to 8pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3, 4, 5],
      },

      // Potrero Hill
      {
        name: 'Potrero Hill Green Station',
        lat: 37.7578,
        lon: -122.3989,
        address: '567 Connecticut Street - Potrero Hill, San Francisco - CA',
        contact: '+1 (415) 555-0126',
        openingHours: 'Monday to Saturday: 8am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3],
      },

      // Dogpatch
      {
        name: 'Dogpatch EcoHub',
        lat: 37.7612,
        lon: -122.3878,
        address: '890 3rd Street - Dogpatch, San Francisco - CA',
        contact: '+1 (415) 555-0127',
        openingHours: 'Monday to Friday: 9am to 7pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 5, 6],
      },

      // Chinatown
      {
        name: 'Chinatown Recycling Center',
        lat: 37.7945,
        lon: -122.4078,
        address: '123 Stockton Street - Chinatown, San Francisco - CA',
        contact: '+1 (415) 555-0128',
        openingHours: 'Every day: 7am to 8pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3, 4],
      },

      // Russian Hill
      {
        name: 'Russian Hill Green Point',
        lat: 37.8012,
        lon: -122.4189,
        address: '456 Hyde Street - Russian Hill, San Francisco - CA',
        contact: '+1 (415) 555-0129',
        openingHours: 'Monday to Saturday: 8am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 8],
      },

      // Bernal Heights
      {
        name: 'Bernal Heights EcoStation',
        lat: 37.7423,
        lon: -122.4156,
        address: '789 Cortland Avenue - Bernal Heights, San Francisco - CA',
        contact: '+1 (415) 555-0130',
        openingHours: 'Monday to Friday: 8am to 6pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 4, 5],
      },

      // Excelsior
      {
        name: 'Excelsior Green Center',
        lat: 37.7234,
        lon: -122.4267,
        address: '234 Mission Street - Excelsior, San Francisco - CA',
        contact: '+1 (415) 555-0131',
        openingHours: 'Monday to Saturday: 9am to 6pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },

      // Bayview
      {
        name: 'Bayview Recycling Hub',
        lat: 37.7289,
        lon: -122.3889,
        address: '567 3rd Street - Bayview, San Francisco - CA',
        contact: '+1 (415) 555-0132',
        openingHours: 'Monday to Friday: 8am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 5, 6],
      },

      // Visitacion Valley
      {
        name: 'Visitacion Valley EcoPoint',
        lat: 37.7156,
        lon: -122.4045,
        address: '890 Leland Avenue - Visitacion Valley, San Francisco - CA',
        contact: '+1 (415) 555-0133',
        openingHours: 'Monday to Saturday: 8am to 6pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 4],
      },

      // Japantown
      {
        name: 'Japantown Green Station',
        lat: 37.7856,
        lon: -122.4312,
        address: '123 Post Street - Japantown, San Francisco - CA',
        contact: '+1 (415) 555-0134',
        openingHours: 'Every day: 9am to 7pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3, 6, 7],
      },

      // Western Addition
      {
        name: 'Western Addition EcoHub',
        lat: 37.7789,
        lon: -122.4289,
        address: '456 Divisadero Street - Western Addition, San Francisco - CA',
        contact: '+1 (415) 555-0135',
        openingHours: 'Monday to Saturday: 8am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 5],
      },

      // MAIS CIDADES DO VALE DO TAQUARI - RS
      // Muçum
      {
        name: 'EcoPonto Muçum Centro',
        lat: -29.1656,
        lon: -51.8734,
        address: 'Av. Santa Terezinha, 1200 - Centro, Muçum - RS',
        contact: '(51) 3754-1234',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'Recicla Muçum Norte',
        lat: -29.1589,
        lon: -51.8812,
        address: 'Rua Norte, 890 - Norte, Muçum - RS',
        contact: '(51) 3754-2345',
        openingHours: 'Segunda a Sábado: 7h às 19h',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 4, 5],
      },

      // Westfália
      {
        name: 'EcoPonto Westfália',
        lat: -29.4234,
        lon: -51.7623,
        address: 'Rua Principal, 567 - Centro, Westfália - RS',
        contact: '(51) 3768-1234',
        openingHours: 'Segunda a Sexta: 8h às 17h',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3],
      },

      // Imigrante
      {
        name: 'EcoPonto Imigrante Centro',
        lat: -29.3512,
        lon: -51.7756,
        address: 'Av. Imigrante, 1100 - Centro, Imigrante - RS',
        contact: '(51) 3775-1234',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'Recicla Imigrante Sul',
        lat: -29.3589,
        lon: -51.7834,
        address: 'Rua Sul, 678 - Sul, Imigrante - RS',
        contact: '(51) 3775-2345',
        openingHours: 'Segunda a Sábado: 7h às 19h',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 4],
      },

      // Pouso Novo
      {
        name: 'EcoPonto Pouso Novo',
        lat: -29.1734,
        lon: -52.2012,
        address: 'Rua Central, 890 - Centro, Pouso Novo - RS',
        contact: '(51) 3779-1234',
        openingHours: 'Segunda a Sexta: 8h às 17h',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3],
      },

      // Progresso
      {
        name: 'EcoPonto Progresso Centro',
        lat: -29.2789,
        lon: -52.3123,
        address: 'Av. Progresso, 1200 - Centro, Progresso - RS',
        contact: '(51) 3785-1234',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },

      // Doutor Ricardo
      {
        name: 'EcoPonto Doutor Ricardo',
        lat: -29.1823,
        lon: -52.0645,
        address: 'Rua Principal, 567 - Centro, Doutor Ricardo - RS',
        contact: '(51) 3782-1234',
        openingHours: 'Segunda a Sexta: 8h às 17h',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3],
      },

      // Vespasiano Corrêa
      {
        name: 'EcoPonto Vespasiano Corrêa',
        lat: -29.0623,
        lon: -51.8534,
        address: 'Av. Central, 890 - Centro, Vespasiano Corrêa - RS',
        contact: '(51) 3756-1234',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3],
      },

      // Putinga
      {
        name: 'EcoPonto Putinga Centro',
        lat: -29.0389,
        lon: -52.1523,
        address: 'Rua Central, 1200 - Centro, Putinga - RS',
        contact: '(51) 3757-1234',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },

      // Santa Clara do Sul
      {
        name: 'EcoPonto Santa Clara do Sul',
        lat: -29.4756,
        lon: -52.0823,
        address: 'Av. Santa Clara, 1100 - Centro, Santa Clara do Sul - RS',
        contact: '(51) 3769-1234',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3],
      },
      {
        name: 'Recicla Santa Clara Industrial',
        lat: -29.4823,
        lon: -52.0912,
        address: 'Av. Industrial, 890 - Industrial, Santa Clara do Sul - RS',
        contact: '(51) 3769-2345',
        openingHours: 'Segunda a Sábado: 7h às 19h',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 5, 6],
      },

      // Forquetinha
      {
        name: 'EcoPonto Forquetinha',
        lat: -29.3845,
        lon: -52.0734,
        address: 'Rua Principal, 678 - Centro, Forquetinha - RS',
        contact: '(51) 3776-1234',
        openingHours: 'Segunda a Sexta: 8h às 17h',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },

      // Marques de Souza
      {
        name: 'EcoPonto Marques de Souza',
        lat: -29.3212,
        lon: -52.0912,
        address: 'Av. Principal, 1200 - Centro, Marques de Souza - RS',
        contact: '(51) 3783-1234',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3],
      },

      // Travesseiro
      {
        name: 'EcoPonto Travesseiro Centro',
        lat: -29.2989,
        lon: -52.0345,
        address: 'Rua Central, 890 - Centro, Travesseiro - RS',
        contact: '(51) 3763-1234',
        openingHours: 'Segunda a Sexta: 8h às 18h',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3],
      },

      // MAIS PONTOS EM SAN FRANCISCO
      // Fisherman's Wharf
      {
        name: "Fisherman's Wharf Green Center",
        lat: 37.8089,
        lon: -122.4167,
        address: "789 Jefferson Street - Fisherman's Wharf, San Francisco - CA",
        contact: '+1 (415) 555-0136',
        openingHours: 'Every day: 6am to 9pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3, 4],
      },
      {
        name: 'Pier 39 Recycling Station',
        lat: 37.8087,
        lon: -122.4098,
        address: "Beach Street & The Embarcadero - Fisherman's Wharf, San Francisco - CA",
        contact: '+1 (415) 555-0137',
        openingHours: 'Every day: 7am to 8pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3],
      },

      // Twin Peaks
      {
        name: 'Twin Peaks EcoStation',
        lat: 37.7544,
        lon: -122.4477,
        address: '123 Twin Peaks Boulevard - Twin Peaks, San Francisco - CA',
        contact: '+1 (415) 555-0138',
        openingHours: 'Monday to Saturday: 8am to 6pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 4, 5],
      },

      // Glen Park
      {
        name: 'Glen Park Green Point',
        lat: 37.7334,
        lon: -122.4345,
        address: '456 Diamond Street - Glen Park, San Francisco - CA',
        contact: '+1 (415) 555-0139',
        openingHours: 'Monday to Friday: 9am to 6pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },

      // Ingleside
      {
        name: 'Ingleside Recycling Hub',
        lat: 37.7245,
        lon: -122.4456,
        address: '789 Ocean Avenue - Ingleside, San Francisco - CA',
        contact: '+1 (415) 555-0140',
        openingHours: 'Monday to Saturday: 8am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 5],
      },

      // Outer Mission
      {
        name: 'Outer Mission EcoCenter',
        lat: 37.7189,
        lon: -122.4378,
        address: '234 Mission Street - Outer Mission, San Francisco - CA',
        contact: '+1 (415) 555-0141',
        openingHours: 'Monday to Friday: 8am to 6pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 4],
      },

      // Portola
      {
        name: 'Portola Green Station',
        lat: 37.7278,
        lon: -122.4012,
        address: '567 San Bruno Avenue - Portola, San Francisco - CA',
        contact: '+1 (415) 555-0142',
        openingHours: 'Monday to Saturday: 8am to 6pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },

      // Crocker Amazon
      {
        name: 'Crocker Amazon Recycling',
        lat: 37.7123,
        lon: -122.4489,
        address: '890 Geneva Avenue - Crocker Amazon, San Francisco - CA',
        contact: '+1 (415) 555-0143',
        openingHours: 'Monday to Friday: 8am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 5, 6],
      },

      // Oceanview
      {
        name: 'Oceanview EcoHub',
        lat: 37.7234,
        lon: -122.4567,
        address: '123 Phelan Avenue - Oceanview, San Francisco - CA',
        contact: '+1 (415) 555-0144',
        openingHours: 'Monday to Saturday: 9am to 6pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 4],
      },

      // Parkside
      {
        name: 'Parkside Green Center',
        lat: 37.7445,
        lon: -122.4934,
        address: '456 Vicente Street - Parkside, San Francisco - CA',
        contact: '+1 (415) 555-0145',
        openingHours: 'Monday to Friday: 8am to 6pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },

      // Forest Hill
      {
        name: 'Forest Hill Recycling Station',
        lat: 37.7456,
        lon: -122.4578,
        address: '789 Dewey Boulevard - Forest Hill, San Francisco - CA',
        contact: '+1 (415) 555-0146',
        openingHours: 'Monday to Saturday: 8am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 5],
      },

      // West Portal
      {
        name: 'West Portal EcoPoint',
        lat: 37.7389,
        lon: -122.4678,
        address: '234 West Portal Avenue - West Portal, San Francisco - CA',
        contact: '+1 (415) 555-0147',
        openingHours: 'Monday to Saturday: 9am to 7pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 6, 7],
      },

      // St. Francis Wood
      {
        name: 'St. Francis Wood Green Station',
        lat: 37.7367,
        lon: -122.4745,
        address: '567 St. Francis Boulevard - St. Francis Wood, San Francisco - CA',
        contact: '+1 (415) 555-0148',
        openingHours: 'Monday to Friday: 8am to 6pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3],
      },

      // Miraloma Park
      {
        name: 'Miraloma Park Recycling Hub',
        lat: 37.7378,
        lon: -122.4534,
        address: '890 Portola Drive - Miraloma Park, San Francisco - CA',
        contact: '+1 (415) 555-0149',
        openingHours: 'Monday to Saturday: 8am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 4, 5],
      },

      // Sunnyside
      {
        name: 'Sunnyside EcoCenter',
        lat: 37.7312,
        lon: -122.4423,
        address: '123 Monterey Boulevard - Sunnyside, San Francisco - CA',
        contact: '+1 (415) 555-0150',
        openingHours: 'Monday to Friday: 9am to 6pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3],
      },

      // Presidio
      {
        name: 'Presidio Green Point',
        lat: 37.7989,
        lon: -122.4662,
        address: '456 Lincoln Boulevard - Presidio, San Francisco - CA',
        contact: '+1 (415) 555-0151',
        openingHours: 'Every day: 6am to 8pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3, 4],
      },
      {
        name: 'Presidio Main Post Recycling',
        lat: 37.7978,
        lon: -122.4589,
        address: '789 Montgomery Street - Presidio, San Francisco - CA',
        contact: '+1 (415) 555-0152',
        openingHours: 'Monday to Friday: 7am to 7pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 5, 6],
      },

      // Seacliff
      {
        name: 'Seacliff EcoStation',
        lat: 37.7845,
        lon: -122.4923,
        address: '234 Sea Cliff Avenue - Seacliff, San Francisco - CA',
        contact: '+1 (415) 555-0153',
        openingHours: 'Monday to Saturday: 8am to 6pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3],
      },

      // Lake Street
      {
        name: 'Lake Street Green Center',
        lat: 37.7834,
        lon: -122.4845,
        address: '567 Lake Street - Richmond, San Francisco - CA',
        contact: '+1 (415) 555-0154',
        openingHours: 'Monday to Friday: 8am to 6pm',
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3, 4],
      },

      // Laurel Heights
      {
        name: 'Laurel Heights Recycling Hub',
        lat: 37.7867,
        lon: -122.4534,
        address: '890 California Street - Laurel Heights, San Francisco - CA',
        contact: '+1 (415) 555-0155',
        openingHours: 'Monday to Saturday: 9am to 6pm',
        userId: savedUsers[1].id,
        categories: [0, 1, 2, 3, 5],
      },

      // Anza Vista
      {
        name: 'Anza Vista EcoPoint',
        lat: 37.7812,
        lon: -122.4478,
        address: '123 Geary Boulevard - Anza Vista, San Francisco - CA',
        contact: '+1 (415) 555-0156',
        openingHours: 'Monday to Friday: 8am to 6pm',
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3],
      },
    ];

    const savedCollectionPoints: CollectionPoint[] = [];
    for (const pointData of collectionPointsData) {
      const existingPoint = await collectionPointRepository.findOne({
        where: { name: pointData.name },
      });

      if (!existingPoint) {
        const { categories: categoryIndices, ...pointInfo } = pointData;
        const collectionPoint = collectionPointRepository.create(pointInfo);
        const savedPoint = await collectionPointRepository.save(collectionPoint);
        savedCollectionPoints.push(savedPoint);
        console.log(`  ✓ Ponto de coleta criado: ${savedPoint.name}`);

        // Associar categorias ao ponto de coleta
        for (const categoryIndex of categoryIndices) {
          const collectionPointCategory = collectionPointCategoryRepository.create({
            collectionPointId: savedPoint.id,
            categoryId: savedCategories[categoryIndex].id,
          });
          await collectionPointCategoryRepository.save(collectionPointCategory);
        }
      } else {
        savedCollectionPoints.push(existingPoint);
        console.log(`  ℹ Ponto de coleta já existe: ${existingPoint.name}`);
      }
    }

    // Criar eventos
    console.log('\n🎉 Criando eventos...');
    const now = new Date();
    const eventsData = [
      {
        title: 'Mutirão de Limpeza Praia Limpa',
        description: 'Vamos juntos limpar a praia e coletar materiais recicláveis. Traga luvas e sacolas!',
        lat: -23.9978,
        lon: -46.2952,
        startAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 dias a partir de hoje
        endAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000), // 4 horas depois
        userId: savedUsers[0].id,
        categories: [0, 1, 2, 3], // Plástico, Papel, Metal, Vidro
      },
      {
        title: 'Workshop de Compostagem Doméstica',
        description: 'Aprenda a fazer compostagem em casa e reduza o desperdício orgânico. Oficina prática e gratuita!',
        lat: -23.5505,
        lon: -46.6333,
        startAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // 14 dias a partir de hoje
        endAt: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000), // 3 horas depois
        userId: savedUsers[1].id,
        categories: [4], // Orgânico
      },
      {
        title: 'Coleta de Eletrônicos Antigos',
        description: 'Descarte corretamente seus eletrônicos velhos. Computadores, celulares, TVs e mais!',
        lat: -23.5629,
        lon: -46.6825,
        startAt: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // 21 dias a partir de hoje
        endAt: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000 + 8 * 60 * 60 * 1000), // 8 horas depois
        userId: savedUsers[2].id,
        categories: [5, 6], // Eletrônicos, Pilhas e Baterias
      },
      {
        title: 'Feira de Troca de Roupas',
        description: 'Traga roupas que não usa mais e troque por outras! Promovendo a economia circular.',
        lat: -23.588,
        lon: -46.6396,
        startAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // 10 dias a partir de hoje
        endAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000), // 5 horas depois
        userId: savedUsers[0].id,
        categories: [8], // Roupas e Têxteis
      },
      {
        title: 'Campanha Coleta de Óleo Usado',
        description: 'Traga seu óleo de cozinha usado. Cada litro coletado gera sabão ecológico!',
        lat: -23.6024,
        lon: -46.6632,
        startAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 dias a partir de hoje
        endAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000), // 6 horas depois
        userId: savedUsers[1].id,
        categories: [7], // Óleo de Cozinha
      },
      {
        title: 'Dia Mundial da Reciclagem - Mega Evento',
        description:
          'Grande evento com diversas atividades: palestras, oficinas, coleta de diversos materiais e muito mais!',
        lat: -23.542,
        lon: -46.5756,
        startAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // 30 dias a partir de hoje
        endAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000 + 10 * 60 * 60 * 1000), // 10 horas depois
        userId: savedUsers[2].id,
        categories: [0, 1, 2, 3, 4, 5, 6, 7, 8], // Todas as categorias principais
      },
    ];

    const savedEvents: Event[] = [];
    for (const eventData of eventsData) {
      const existingEvent = await eventRepository.findOne({
        where: { title: eventData.title },
      });

      if (!existingEvent) {
        const { categories: categoryIndices, ...eventInfo } = eventData;
        const event = eventRepository.create(eventInfo);
        const savedEvent = await eventRepository.save(event);
        savedEvents.push(savedEvent);
        console.log(`  ✓ Evento criado: ${savedEvent.title}`);

        // Associar categorias ao evento
        for (const categoryIndex of categoryIndices) {
          const eventCategory = eventCategoryRepository.create({
            eventId: savedEvent.id,
            categoryId: savedCategories[categoryIndex].id,
          });
          await eventCategoryRepository.save(eventCategory);
        }
      } else {
        savedEvents.push(existingEvent);
        console.log(`  ℹ Evento já existe: ${existingEvent.title}`);
      }
    }

    console.log('\n✅ Seed concluído com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`  - Usuários: ${savedUsers.length}`);
    console.log(`  - Categorias: ${savedCategories.length}`);
    console.log(`  - Pontos de Coleta: ${savedCollectionPoints.length}`);
    console.log(`  - Eventos: ${savedEvents.length}`);
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('\n🔌 Conexão com banco de dados fechada');
  }
}

seed();
