export const jwtConstants = {
  secret: 'chat de lautaro :D'
}

export const httpConstants = {
  port: 3000,
  origin: [
    !process.env.PROD ? 'http://localhost:5173'
      : ''
  ]
}

export const wsConstants = {
  port: 3001,
  origin: [
    !process.env.PROD ? 'http://localhost:5173'
      : ''
  ]
}