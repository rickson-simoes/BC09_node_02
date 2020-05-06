### Docker Install POSTGRES
`docker run --name curso_postgres -e POSTGRES_PASSWORD=1234 -p 5432:5432 -d postgres`

### TypeORM - Orm Typescript
https://typeorm.io/

# Criar migrations
`yarn typeorm migration:create -n CreateAppointments`

# executar migration
`yarn typeorm migration:run`

# reverter migration
`yarn typeorm migration:revert`

# exibir migration que já foram executadas
`yarn typeorm migration:show`

# MD5 Generator
`NodeRicksonApp`
