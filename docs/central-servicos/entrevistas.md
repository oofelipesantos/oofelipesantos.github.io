# Perguntas e respostas para entrevistas

As respostas abaixo são pontos de partida. O ideal é contar com suas palavras e acrescentar detalhes apenas quando você conseguir mostrar a decisão no código.

## 1. Fale sobre o projeto

Desenvolvi uma Central de Serviços de TI em Java 21 e Spring Boot e participei também da implantação. O sistema cobre abertura e acompanhamento de chamados, tarefas internas, SLA, perfis de acesso, auditoria, relatórios e operação. Eu costumo destacar que não foi só um CRUD: precisei tratar transações, concorrência, calendário comercial, segurança de anexos, migrations e instalação local.

## 2. Por que um monólito?

A implantação precisava ser simples em um ambiente local e o domínio ainda cabia bem em uma única aplicação. Um monólito modular manteve transações locais, um ciclo de deploy e menos pontos de falha. Mesmo assim, separei controllers, services, repositories, DTOs e regras de domínio. Eu só extrairia um serviço quando houvesse uma necessidade medida, como escala independente ou isolamento de falha.

## 3. Como você evita protocolos duplicados?

A sequência anual fica em uma tabela própria. No SQL Server, a leitura e atualização usam bloqueio transacional, e existe uma chave única para tipo e ano. Assim, duas transações concorrentes não recebem o mesmo número. Em testes com outro banco há um caminho JPA com lock pessimista.

## 4. Onde você colocou as transações?

Na camada de serviço, junto das operações de negócio. A abertura do chamado e a criação da tarefa de triagem acontecem na mesma transação. O mesmo princípio vale para mudanças de estado que precisam atualizar auditoria, tarefas ou prazos de forma consistente.

## 5. Como funciona o SLA?

Existem metas de primeira resposta e resolução por prioridade. O cálculo percorre somente o horário comercial, ignora finais de semana e feriados cadastrados e acumula pausas controladas. O sistema registra também o tempo aguardando o solicitante. Os valores aplicados ficam gravados no chamado para preservar o contexto mesmo se a política mudar depois.

## 6. Como a autorização é aplicada?

Spring Security protege as rotas por perfil, mas as regras não ficam só no controller. A camada de serviço verifica se o usuário pode acessar o chamado, a tarefa ou o anexo. Isso evita depender da interface e protege chamadas feitas por outros caminhos.

## 7. Como você protege os anexos?

Eles ficam fora da pasta pública. A aplicação valida tamanho, extensão e MIME, troca o nome por um UUID, normaliza o caminho, calcula SHA-256 e exige autorização antes do download. Comentários internos também impedem que um solicitante acesse o anexo correspondente.

## 8. Como você tratou concorrência além da numeração?

Chamados e tarefas têm versionamento otimista com `@Version`. A ação de assumir uma tarefa livre usa uma atualização condicional no repositório, então apenas uma tentativa consegue alterar o registro no estado esperado. O serviço converte a disputa em uma resposta de negócio compreensível.

## 9. Como você testa o sistema?

Há testes de regra e testes com Spring Boot e MockMvc que atravessam segurança, controller, service e repository. Os cenários cobrem ciclo do chamado, portal público, contas, SLA, anexos, WIP, exclusão lógica e relatórios. O CI usa H2 em modo compatível; o SQL Server tem um fluxo separado. Eu reconheço que tornar esse teste real obrigatório no pipeline é uma melhoria importante.

## 10. Como o banco evolui?

O Flyway versiona a criação e as alterações do esquema. Isso deixa instalação e atualização reproduzíveis. As migrations também registram constraints e índices, não só tabelas. Em produção, qualquer alteração precisa respeitar compatibilidade e backup.

## 11. Qual foi uma decisão difícil?

O SLA foi uma das partes mais trabalhosas porque uma data final simples não representa horário comercial, feriados e pausas. A solução foi separar o serviço de calendário e testar bordas como fim do expediente, fim de semana, feriado e retorno de pausa.

## 12. O que você faria diferente hoje?

Eu colocaria desde cedo métricas de qualidade e operação no pipeline: cobertura, análise estática, teste recorrente com SQL Server e telemetria centralizada. Também registraria decisões arquiteturais curtas em ADRs para deixar os trade-offs mais fáceis de acompanhar.

## 13. O sistema está pronto para alta escala?

Eu não afirmo isso porque não há teste de carga ou SLO publicado. A arquitetura é adequada ao uso atual. Antes de escalar, eu mediria consultas, pool, uso de anexos e endpoints críticos; depois decidiria entre otimização, cache, processamento assíncrono ou separação de componentes.

## 14. O que se relaciona com o setor financeiro?

O projeto não é financeiro, mas trabalha fundamentos importantes: consistência transacional, autorização, auditoria, evolução de banco, testes e operação. Estou complementando essa base com estudo de idempotência, mensageria, ledger e segurança de APIs.

## 15. Conte um erro ou limitação

Uma resposta honesta é explicar que o pipeline padrão valida a aplicação com H2, mas diferenças de dialeto podem aparecer no SQL Server. O projeto já possui um fluxo específico para o banco real; a melhoria é executá-lo de forma automatizada e recorrente no CI. Isso mostra uma limitação concreta e um plano técnico, sem tentar esconder o problema.
