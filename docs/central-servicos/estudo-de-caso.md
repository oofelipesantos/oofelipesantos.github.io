# Estudo de caso

## Contexto

Solicitações de TI perdem contexto quando ficam espalhadas entre conversas, mensagens e controles paralelos. A equipe precisa saber o que entrou, quem está atendendo, qual é o próximo passo, quando o prazo vence e o que aconteceu antes de uma mudança de status.

A Central de Serviços de TI foi desenvolvida para transformar esse fluxo em um processo rastreável. A versão 1.7.5 está em produção e possui usuários reais. Por confidencialidade, o estudo não informa a empresa, a quantidade de usuários, o volume de chamados ou dados operacionais.

## Problema

O desafio não era apenas criar um formulário. O sistema precisava conciliar três perspectivas:

- o solicitante quer abrir uma demanda e acompanhar respostas sem conhecer o processo interno;
- a equipe técnica precisa triar, atribuir, executar, registrar tempo e controlar dependências;
- a administração precisa configurar catálogos, permissões, SLA, armazenamento e auditoria.

Também havia uma restrição prática: a solução deveria ser instalável em infraestrutura Windows com SQL Server e operável por uma equipe pequena.

## Solução

A aplicação foi organizada como um monólito modular Spring MVC. As páginas são renderizadas no servidor com Thymeleaf; JavaScript fica concentrado nas interações que precisam de mais dinamismo, como Kanban e quadros de projeto.

Quando um chamado é criado, o sistema gera um protocolo e cria a tarefa inicial de triagem na mesma transação. O atendimento evolui por estados controlados, registra responsáveis, comentários, anexos, apontamentos e alterações relevantes. O solicitante recebe apenas o conteúdo público; notas internas permanecem restritas à equipe.

O portal público permite abertura sem conta. O acompanhamento depende de protocolo e código privado, cujo valor não é persistido em texto puro. Há CAPTCHA de uso único, campo-isca e limites por origem para reduzir abuso.

## Decisões técnicas

### Monólito modular

Para uma implantação local, separar a aplicação em serviços independentes aumentaria o custo de operação sem uma necessidade comprovada. O monólito mantém um único ciclo de deploy e transações locais, enquanto a divisão em controllers, services, repositories, DTOs e módulos de domínio preserva responsabilidades claras.

### Concorrência e consistência

O protocolo anual não é calculado com um simples `count + 1`. No SQL Server, a sequência é atualizada com bloqueio transacional. A tomada de uma tarefa livre usa uma atualização condicional, evitando que dois técnicos assumam o mesmo item ao mesmo tempo. Chamados e tarefas usam `@Version` para detectar atualizações concorrentes.

### SLA como regra de domínio

O SLA não é somente uma coluna com uma data. O cálculo considera horário comercial configurável, dias úteis, feriados e intervalos pausados. Há distinção entre prazo de primeira resposta e resolução, além do tempo em espera pelo solicitante.

### Anexos fora da área pública

Arquivos recebem nome aleatório, são organizados fora dos assets públicos e só são entregues depois da autorização. A aplicação valida tamanho, extensão e MIME, normaliza o caminho e registra checksum SHA-256. Essa decisão reduz riscos de acesso direto e travessia de diretório.

### Banco evoluído por migrations

O Flyway registra a evolução do esquema. As 32 migrations da versão analisada mostram o crescimento do sistema: tabelas básicas, segurança, chamados, tarefas, anexos, auditoria, SLA, portal público, quadros de projeto, retenção e preferências.

## Operação

O pacote de implantação reúne aplicação, Apache e SQL Server local opcional em Docker Compose. As redes pública e privada são separadas; o proxy não participa da rede do banco. Dados, anexos e logs persistem fora dos containers. Scripts PowerShell cobrem instalação, inicialização, diagnóstico, backup, restauração e atualização, e o instalador NSIS organiza a experiência no Windows.

## Testes

Os testes cobrem regras de serviço e fluxos web com segurança ativa. Entre os cenários estão ciclo do chamado, portal público, aprovação de contas, SLA em calendário comercial, autorização de anexos, exclusão lógica, limite de trabalho em andamento, quadros de projeto, relatórios e artefatos de infraestrutura.

O pipeline compila os assets, prepara Java 21 e executa `mvn clean verify`. O teste contra SQL Server é um fluxo separado; torná-lo uma etapa recorrente do CI é uma melhoria planejada.

## Aprendizados

- regras simples na interface precisam continuar protegidas no backend;
- datas de SLA exigem uma representação explícita de calendário e pausas;
- concorrência precisa ser tratada no banco e na aplicação, não apenas pela experiência da tela;
- empacotamento, backup e diagnóstico fazem parte do produto quando a implantação é local;
- uma trilha de auditoria útil precisa nascer junto com as operações de domínio;
- documentação operacional e documentação de portfólio servem a públicos diferentes.

## Resultado que pode ser afirmado

O sistema foi colocado em produção e é utilizado por pessoas reais. Ele consolidou em uma única aplicação o fluxo de chamados, tarefas, SLA, comunicação, relatórios e administração descrito acima.

Não são publicados percentuais de produtividade, redução de prazo ou volume de atendimento porque essas métricas ainda não foram formalmente coletadas.
