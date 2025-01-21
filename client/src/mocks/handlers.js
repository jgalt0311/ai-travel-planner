import { rest } from 'msw';

export const handlers = [
  // Auth handlers
  rest.post('/api/auth/login', (req, res, ctx) => {
    const { email, password } = req.body;
    
    if (email === 'test@example.com' && password === 'password123') {
      return res(
        ctx.status(200),
        ctx.json({
          token: 'fake-jwt-token',
          user: {
            id: '1',
            email: 'test@example.com',
            username: 'testuser'
          }
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({ error: 'Invalid credentials' })
    );
  }),

  rest.post('/api/auth/signup', (req, res, ctx) => {
    const { email, username } = req.body;
    
    return res(
      ctx.status(201),
      ctx.json({
        token: 'fake-jwt-token',
        user: {
          id: '1',
          email,
          username
        }
      })
    );
  }),

  rest.get('/api/auth/me', (req, res, ctx) => {
    const token = req.headers.get('Authorization');
    
    if (token === 'Bearer fake-jwt-token') {
      return res(
        ctx.status(200),
        ctx.json({
          id: '1',
          email: 'test@example.com',
          username: 'testuser'
        })
      );
    }
    
    return res(
      ctx.status(401),
      ctx.json({ error: 'Unauthorized' })
    );
  }),

  // Itinerary handlers
  rest.post('/api/itineraries', (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        _id: '1',
        ...req.body,
        createdAt: new Date().toISOString()
      })
    );
  }),

  rest.get('/api/itineraries/:id', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        _id: req.params.id,
        title: 'Test Itinerary',
        destination: {
          name: 'Paris',
          coordinates: { latitude: 48.8566, longitude: 2.3522 }
        },
        days: [
          {
            date: '2025-02-01',
            activities: [],
            weatherForecast: {
              temperature: 20,
              condition: 'sunny',
              precipitation: 0
            }
          }
        ]
      })
    );
  })
];