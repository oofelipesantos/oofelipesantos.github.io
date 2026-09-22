# Central de Serviços de TI

> Estudo de caso de uma aplicação web em produção. Versão analisada: 1.7.5.

A Central de Serviços de TI organiza o ciclo de atendimento entre solicitantes e a equipe técnica: entrada da demanda, triagem, execução, comunicação, controle de prazo, encerramento e auditoria. O projeto nasceu de uma necessidade operacional real e hoje possui usuários reais.

Este material não publica a base de produção nem apresenta métricas que não tenham sido coletadas. As imagens usam exclusivamente a identidade **Empresa Demonstração** e conteúdo fictício.

## O que o sistema resolve

- centraliza chamados abertos por usuários autenticados ou pelo portal público;
- separa as permissões de solicitante, técnico, gestor de TI e administrador;
- transforma a triagem em tarefas executáveis, com subtarefas, responsáveis e limite de trabalho em andamento;
- calcula prazos de SLA com horário comercial, feriados e pausas controladas;
- mantém comentários públicos e internos, anexos autorizados, histórico e auditoria;
- oferece dashboards, relatórios operacionais, resumo diário, Kanban e quadros de projeto;
- inclui instalação local com Docker, SQL Server, Apache e instalador Windows.

## Stack comprovada no repositório

| Camada | Tecnologias e decisões |
|---|---|
| Aplicação | Java 21, Spring Boot 4.1, Spring MVC, validação e Thymeleaf |
| Segurança | Spring Security, BCrypt, CSRF, controle por perfil e autorização na camada de serviço |
| Persistência | Spring Data JPA, Hibernate, SQL Server e 32 migrations Flyway |
| Operação | Docker Compose, redes separadas, Apache como proxy, volumes persistentes e health checks |
| Qualidade | JUnit, MockMvc, Mockito, H2 e pipeline no GitHub Actions |
| Distribuição | Maven Wrapper, PowerShell e instalador Windows com NSIS |

## Decisões que merecem atenção

1. **Monólito modular.** Controllers recebem HTTP, services concentram regras e transações, repositories cuidam da persistência e specifications montam filtros. A escolha reduz a complexidade operacional para uma implantação local sem impedir a separação de responsabilidades.
2. **Integridade sob concorrência.** A numeração anual usa bloqueio no SQL Server; a atribuição de trabalho usa atualização condicional; chamados e sua tarefa inicial são gravados na mesma transação; entidades críticas usam versionamento otimista.
3. **SLA baseado em tempo útil.** O prazo considera calendário comercial, finais de semana, feriados e pausas. O tempo aguardando o solicitante é registrado separadamente.
4. **Segurança em profundidade.** Há proteção nas rotas e nos serviços, limitação de tentativas, trilha de login, anexos fora da área pública, validação de MIME/extensão/tamanho e normalização de caminho.
5. **Evolução de banco versionada.** O esquema não depende de criação manual: migrations registram a evolução até SLA, quadros de projeto, preferências e cronômetro de trabalho.

## Qualidade verificada

Na auditoria da versão 1.7.5 foram encontrados 26 arquivos Java na área de testes e 118 métodos anotados com `@Test`. O fluxo equivalente ao CI — compilação dos assets e `mvn clean verify` — terminou com 118 testes executados, nenhuma falha ou erro e um smoke test de SQL Server ignorado por depender do ambiente específico.

Isso demonstra uma base de testes relevante, mas não equivale a afirmar cobertura percentual: o projeto ainda não gera relatório JaCoCo no pipeline. Os testes padrão usam H2 em modo de compatibilidade; a validação real no SQL Server existe como fluxo separado e deve ser fortalecida no CI.

## Navegação

- [Problema, solução e aprendizados](estudo-de-caso.md)
- [Arquitetura](arquitetura.md)
- [Modelo de dados](modelo-de-dados.md)
- [Currículo e LinkedIn](curriculo-linkedin.md)
- [Perguntas para entrevistas](entrevistas.md)
- [Competências e próximos estudos](competencias-e-estudos.md)
- [Posicionamento para o setor financeiro](estrategia-setor-financeiro.md)
- [Auditoria e plano de apresentação](auditoria-e-plano.md)

## Limite do estudo de caso

Este projeto comprova experiência com um sistema corporativo transacional em produção. Ele não é apresentado como plataforma bancária, sistema de pagamentos ou arquitetura de alta escala. A relação com o setor financeiro está nas práticas transferíveis — integridade, autorização, rastreabilidade, SQL, testes e operação — e não em uma experiência de domínio que o projeto não possui.
