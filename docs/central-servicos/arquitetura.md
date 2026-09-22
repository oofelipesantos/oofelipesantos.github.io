# Arquitetura

A Central de Serviços de TI é um monólito modular com renderização no servidor. A topologia abaixo representa a implantação suportada pelo projeto, sem endereços do ambiente real.

```mermaid
flowchart LR
    U[Usuários e portal público] --> A[Apache HTTP Server]
    A --> S[Spring Boot / Spring MVC]
    S --> SEC[Spring Security]
    S --> D[Serviços de domínio]
    D --> J[JPA / Hibernate]
    J --> DB[(SQL Server)]
    D --> F[(Anexos privados)]
    S --> L[(Logs)]
    M[Flyway] --> DB
```

## Responsabilidades

| Componente | Responsabilidade |
|---|---|
| Apache | entrada HTTP, proxy reverso, headers e entrega da página de indisponibilidade |
| Spring Security | autenticação, sessão, CSRF, autorização de rotas e headers de segurança |
| Controllers | rotas, formulários e respostas HTML, JSON ou CSV |
| Services | transações, autorização de domínio, SLA, workflow, auditoria e armazenamento |
| Repositories e specifications | persistência JPA e filtros dinâmicos |
| SQL Server | dados transacionais, integridade referencial, índices e bloqueios necessários |
| Flyway | evolução versionada do esquema |
| Volumes | persistência de anexos e logs fora da imagem da aplicação |

## Fluxo de um chamado

```mermaid
sequenceDiagram
    actor Solicitante
    participant Web as Controller
    participant Seg as Spring Security
    participant Serv as TicketService
    participant Num as NumberSequenceService
    participant DB as SQL Server
    participant Audit as Auditoria

    Solicitante->>Web: envia formulário
    Web->>Seg: sessão, perfil e CSRF
    Seg-->>Web: requisição autorizada
    Web->>Serv: cria chamado
    Serv->>Num: solicita próximo protocolo
    Num->>DB: atualiza sequência com bloqueio
    Serv->>DB: grava chamado e tarefa de triagem
    Serv->>Audit: registra atividade
    Serv-->>Web: devolve protocolo
    Web-->>Solicitante: detalhe do chamado
```

## Decisões de implantação

- o Apache e a aplicação compartilham uma rede de entrada;
- aplicação e banco compartilham uma rede privada separada;
- o banco não precisa ser publicado para a rede quando roda no mesmo host;
- configurações variáveis ficam fora da imagem;
- reiniciar ou reconstruir containers não remove os volumes persistentes.

## Por que esta arquitetura é coerente

O sistema precisa ser instalável e mantido localmente. Um monólito modular reduz os pontos de falha, simplifica transações e facilita diagnóstico. Caso a carga ou os limites organizacionais mudem, os módulos de notificação, anexos e relatórios são candidatos naturais a extração — mas essa complexidade não foi antecipada sem necessidade medida.
