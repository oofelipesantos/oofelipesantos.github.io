# Auditoria inicial e plano de apresentação

Data da revisão: 22 de setembro de 2026. Versão analisada: 1.7.5.

## Diagnóstico do repositório da aplicação

| Área | Situação encontrada | Decisão para o portfólio |
|---|---|---|
| Código original | branch principal limpa e sincronizada | não alterar; trabalhar no repositório do portfólio |
| README | tecnicamente rico, mas longo e orientado à instalação e operação | criar uma narrativa separada para recrutadores |
| Documentação | arquitetura, segurança, regras, operação, testes e guias por pasta | aproveitar apenas fatos verificáveis e reescrever para público externo |
| Arquitetura | monólito modular Spring MVC, SQL Server, Flyway, Apache e Docker | destacar trade-offs, transações e limites, não apenas a lista de tecnologias |
| Testes | 26 arquivos Java na área de teste e 118 métodos `@Test` na versão analisada | mencionar o escopo; não afirmar cobertura percentual |
| Banco | 32 migrations Flyway e modelo relacional amplo | publicar um diagrama conceitual simplificado |
| Segurança | controles relevantes no código e na infraestrutura | apresentar evidências sem revelar configuração do ambiente |
| Demonstração | perfil demo e conteúdo fictício já previstos no código | produzir imagens apenas com Empresa Demonstração |

## Triagem de confidencialidade

A busca automatizada no estado atual e no histórico não encontrou a marca que não deve ser publicada, chaves privadas ou padrões de tokens GitHub e AWS. Os arquivos rastreados contêm placeholders, variáveis de ambiente, dados reservados de teste e endereços de loopback ou faixas privadas usados em exemplos e testes.

Essa triagem não é uma certificação de ausência de segredos. Antes de tornar o fonte público ou divulgar o link, ainda é recomendado:

- executar uma ferramenta dedicada, como Gitleaks, em todo o histórico;
- revisar manualmente exemplos de configuração, scripts e documentação;
- verificar imagens, releases, issues, Actions e artefatos fora do Git;
- confirmar que qualquer credencial já utilizada foi rotacionada;
- revisar o repositório no GitHub com secret scanning e push protection.

O portfólio não depende de publicar o fonte completo. A página do estudo de caso não aponta para o repositório da aplicação.

O formulário do portfólio utiliza um identificador público do Web3Forms, necessário para o envio no navegador. Ele foi mantido por decisão do proprietário e não deve ser confundido com senha, token da aplicação ou credencial de produção. O número de telefone que antes aparecia no JavaScript e nos links do site foi removido.

## Pontos fortes para demonstração

1. SLA em calendário comercial com feriados e pausas.
2. Concorrência na numeração e na tomada de trabalho.
3. Segurança de anexos e separação entre mensagens públicas e internas.
4. Portal público com código privado, rate limit e vínculo controlado.
5. Evolução do banco com migrations.
6. Implantação local completa, incluindo backup e instalador.
7. Testes de fluxo atravessando segurança, controller, service e repository.

## Lacunas que prejudicavam a apresentação

- o site priorizava Android e automação, não backend Java/Spring;
- o principal sistema em produção não aparecia como projeto de destaque;
- havia percentuais de resultado sem fonte registrada;
- faltavam estudo de caso, diagramas, texto de entrevista e limites honestos;
- o README da aplicação funcionava como manual, não como apresentação;
- não havia relatório de cobertura nem teste SQL Server obrigatório no CI;
- o POM declara Testcontainers, mas a suíte atual não utiliza containers diretamente no código de teste;
- a documentação de instalação contém uma referência antiga ao nome de um instalador, apesar da versão atual estar correta no restante do projeto.

## Organização proposta

```text
site
├── início: posicionamento Backend Java/Spring
├── projetos: Central de Serviços em primeiro lugar
└── estudo de caso: leitura rápida, decisões e imagens fictícias

docs/central-servicos
├── README técnico
├── estudo de caso
├── arquitetura e banco
├── currículo e LinkedIn
├── entrevistas
├── competências e estudos
└── estratégia para o setor financeiro
```

## Próximas etapas que dependem de dados reais

- confirmar se existe alguma métrica formal de adoção, prazo ou redução de retrabalho;
- confirmar quais telas podem ser reproduzidas em um ambiente demo isolado;
- definir se o repositório da aplicação permanecerá privado ou terá uma edição demonstrativa;
- substituir as composições visuais por capturas do perfil demo, se houver autorização e revisão final.
