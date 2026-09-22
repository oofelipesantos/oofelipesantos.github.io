# Competências comprovadas e próximos estudos

## O que o projeto comprova

| Competência | Evidência no projeto |
|---|---|
| Java e Spring MVC | aplicação Java 21 organizada em controllers, services, DTOs e tratamento de exceções |
| Regras transacionais | criação conjunta de chamado e triagem, fechamento, reabertura e numeração concorrente |
| Spring Security | sessão, BCrypt, CSRF, perfis, rate limit e autorização também nos serviços |
| JPA/Hibernate | entidades, relacionamentos, specifications, locking e versionamento otimista |
| SQL Server | esquema relacional, índices, constraints, migrations e consultas operacionais |
| Testes automatizados | testes de serviço e fluxos web com JUnit, MockMvc, Mockito e H2 |
| Segurança de arquivos | validação, checksum, caminho normalizado e download autorizado |
| DevOps prático | CI no GitHub Actions, Docker Compose, health checks e scripts operacionais |
| Entrega em Windows | configuração externa, PowerShell, backup, restauração e instalador NSIS |
| Documentação | guias técnicos, funcionais, de instalação e operação |

Essas evidências permitem dizer que há experiência prática. Elas não justificam os títulos “especialista”, “arquiteto” ou “engenheiro de plataforma”.

## O que ainda precisa de estudo ou evidência

1. **Mensageria e processamento assíncrono.** Estudar Kafka ou RabbitMQ, idempotência, retry, dead letter e padrões de entrega.
2. **Arquiteturas distribuídas.** Entender limites de serviço, consistência eventual, observabilidade e custo operacional antes de falar em microsserviços.
3. **Cloud e orquestração.** Implantar um laboratório em uma nuvem pública, com infraestrutura como código, secrets manager e monitoração.
4. **Observabilidade completa.** Evoluir de health checks e logs estruturados para métricas úteis, tracing, correlação e alertas.
5. **Segurança para o setor financeiro.** Aprofundar OAuth 2.1/OIDC, gestão de chaves, OWASP ASVS, threat modeling e segurança de supply chain.
6. **Testes de banco real no CI.** Executar migrations e integrações do SQL Server de forma recorrente, não apenas em um fluxo separado.
7. **Medição de qualidade.** Adicionar cobertura com JaCoCo, análise estática e limites de regressão com critérios sensatos.
8. **Performance.** Criar testes de carga, definir SLOs e observar gargalos com dados antes de afirmar escala.
9. **Domínio financeiro.** Estudar pagamentos, conciliação, ledger, liquidação, antifraude e requisitos regulatórios sem dizer que este projeto já cobre esses assuntos.
10. **Inglês técnico e entrevistas.** Praticar explicação de decisões, trade-offs e incidentes em inglês.

## Próximo projeto recomendado

Um serviço pequeno de transferências fictícias pode complementar este portfólio: API REST, ledger de dupla entrada, idempotência, fila de eventos, OAuth/OIDC, Postgres ou SQL Server, Testcontainers, observabilidade e testes de concorrência. Ele deve ser apresentado como laboratório, separado do sistema em produção.
