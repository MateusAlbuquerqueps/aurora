# Definição do Projeto: Aurora (App Web de Clima)

> Documento de premissas criado em 04/10/2026 a partir de uma entrevista.
> Serve de referência para todas as decisões do projeto. Atualize sempre que algo mudar.

---

## 1. Visão geral

Um **aplicativo web de acompanhamento do clima** que funciona bem em qualquer tela, de um celular pequeno a um monitor grande, e pode ser "instalado" no celular como um app (PWA).

| Item | Decisão |
|---|---|
| **Objetivo** | Projeto de **portfólio**: demonstrar habilidades técnicas e de design para recrutadores e clientes |
| **Abrangência** | **Mundial**: qualquer cidade do mundo |
| **Idiomas** | **Português e inglês**, escolhidos pelo usuário |
| **Unidades** | **Alternáveis**: °C/°F, km/h / mph / m/s, mm/pol |
| **Orçamento** | **Zero**: só serviços e hospedagem gratuitos |
| **Nível do autor** | Iniciante em programação, então as soluções devem ser simples e bem documentadas |
| **Nome** | **Aurora** |
| **Endereços** | App: https://aurora-six-rho.vercel.app/ · Código: https://github.com/MateusAlbuquerqueps/aurora |

### O que significa "portfólio" para as decisões
Como o objetivo é mostrar trabalho, o app precisa **parecer profissional**: visual bonito, rápido, sem erros, código organizado e um README caprichado com prints e link para a versão online.

---

## 2. Como o usuário escolhe o local

Todas as formas abaixo fazem parte do escopo:

1. **GPS do aparelho**: detecta onde o usuário está (o navegador pede permissão). Se a permissão for negada, o app cai na busca sem dar erro.
2. **Busca por cidade**: campo com sugestões enquanto digita (ex.: "São Pa..." → "São Paulo, SP, Brasil").
3. **Cidades favoritas**: salvar várias cidades e alternar rapidamente entre elas. Ficam salvas no próprio aparelho do usuário, sem necessidade de login.
4. **Clicar no mapa**: tocar em qualquer ponto do mapa para ver o clima dali.

---

## 3. Informações de clima exibidas

### 3.1 Clima agora
- Temperatura e ícone/descrição da condição (ensolarado, nublado, chuva...)
- **Sensação térmica** e **umidade relativa**
- **Vento**: velocidade, direção e rajadas
- **Índice UV**, **nascer e pôr do sol**
- **Pressão atmosférica**, **visibilidade** e **ponto de orvalho**

### 3.2 Previsão
- **Hora a hora**: próximas 48 horas
- **Diária**: próximos 7 dias (com opção de ver até 16 dias, sinalizando que a confiabilidade cai)
- **Chuva**: sempre mostrar **probabilidade (%)** e **volume (mm)** juntos

### 3.3 Histórico e comparações
- Comparar o dia com a média histórica (ex.: *"Hoje está 4 °C acima da média para outubro"*)
- Gráficos de anos anteriores na mesma data

### 3.4 Recursos extras
- **Qualidade do ar** (índice AQI e poluentes principais)
- **Alertas meteorológicos** oficiais
- **Mapa** com camadas de radar de chuva, nuvens e temperatura
- **Gráficos interativos**: curva de temperatura, barras de chuva, direção do vento

---

## 4. Glossário de clima (para consulta)

Termos que vão aparecer no app e no desenvolvimento:

| Termo | O que é | Por que importa |
|---|---|---|
| **Sensação térmica** | Temperatura que o corpo "sente", ajustada por vento (esfria) e umidade (esquenta) | Às vezes é mais útil que a temperatura real |
| **Umidade relativa** | Quanto vapor d'água há no ar, de 0% a 100% | Abaixo de 30%: ar seco, faz mal à saúde. Acima de 80%: abafado |
| **Ponto de orvalho** | Temperatura em que o ar fica saturado e forma orvalho ou neblina | Indica melhor que a umidade se o dia está abafado. Acima de 20 °C é desconfortável |
| **Pressão atmosférica** | Peso do ar sobre a superfície, medido em hPa (normal ≈ 1013 hPa) | Pressão **caindo** costuma indicar mau tempo chegando |
| **Rajada** | Pico momentâneo do vento, mais forte que a média | É o que derruba árvores e é usado nos alertas |
| **Índice UV** | Intensidade da radiação solar, de 0 a 11+ | 6 ou mais: protetor solar obrigatório. 11+: extremo |
| **Probabilidade de precipitação** | Chance de chover naquele período | **Não** diz quanto vai chover |
| **Volume de precipitação (mm)** | Quantidade de chuva. 1 mm = 1 litro por m² | 1–2 mm/h: fraca. 10+ mm/h: forte. 50+ mm/h: temporal |
| **AQI (Índice de Qualidade do Ar)** | Nota de poluição do ar | 0–50: bom. 100+: ruim para grupos sensíveis. 150+: ruim para todos |
| **PM2.5 / PM10** | Partículas finas no ar (fumaça, poeira) | Principal poluente em queimadas |
| **Visibilidade** | Distância em que se enxerga com clareza | Neblina e fumaça reduzem; importante para quem dirige |
| **Radar** | Imagem que mostra onde está chovendo agora e com que intensidade | Permite ver a chuva "chegando" |
| **Modelo de previsão** | Programa de supercomputador que simula a atmosfera (ex.: GFS, ECMWF, ICON) | As APIs entregam o resultado desses modelos. Previsões acima de ~7 dias são pouco confiáveis |

---

## 5. Tecnologia escolhida (e por quê)

O autor ainda não programa, então a escolha prioriza **facilidade de aprendizado, quantidade de material de estudo, valor no mercado e custo zero**.

| Camada | Escolha | Por que esta |
|---|---|---|
| **Linguagem** | **TypeScript** | É JavaScript (a linguagem da web) com "tipos", que apontam erros enquanto você escreve, antes de o app quebrar. Para quem está começando, isso evita muita frustração. É também muito exigida em vagas |
| **Biblioteca de interface** | **React** | A mais usada do mercado. Tem a maior quantidade de tutoriais, cursos e respostas prontas, e é a que as IAs de programação conhecem melhor. Isso ajuda muito um iniciante |
| **Ferramenta de build** | **Vite** | Cria e roda o projeto com um comando, e atualiza a tela na hora a cada mudança. Mais simples e rápido que alternativas como o Next.js, que traz conceitos de servidor desnecessários aqui |
| **Estilos (CSS)** | **Tailwind CSS** | Facilita deixar o app responsivo (adaptar ao tamanho da tela) e aplicar tema claro/escuro direto no código, sem gerenciar arquivos de CSS gigantes |
| **Gráficos** | **Recharts** | Biblioteca de gráficos feita para React, simples de usar e interativa |
| **Mapa** | **Leaflet** + mapas do **OpenStreetMap** | Gratuitos e sem necessidade de cadastro ou cartão de crédito (diferente do Google Maps) |
| **Tradução PT/EN** | **react-i18next** | Padrão de mercado para apps com vários idiomas |
| **PWA (instalável/offline)** | **vite-plugin-pwa** | Transforma o site em app instalável com pouca configuração |
| **Hospedagem** | **Vercel** (gratuito) | Publica o site automaticamente a cada atualização no GitHub e gera um link para o portfólio |
| **Código-fonte** | **GitHub** | Onde recrutadores vão olhar o código |

### Glossário de tecnologia (para quem não programa)
- **Node.js / npm**: o "motor" que roda as ferramentas de desenvolvimento no computador, e a "loja" de onde baixamos bibliotecas prontas. A pasta `node_modules/` guarda o que foi baixado e é recriada com `npm install`.
- **TypeScript**: a linguagem em que o app é escrito (arquivos `.ts` e `.tsx`). É JavaScript, a língua dos navegadores, com verificação de erros antes de rodar.
- **React**: organiza a tela em "peças" reutilizáveis, chamadas componentes. O cartão "Próximos 7 dias" é uma peça (`src/components/DailyForecast.tsx`).
- **Vite**: liga o app no computador para testar (`npm run dev`), atualizando a tela na hora a cada mudança, e gera a versão final para publicar (`npm run build`).
- **Tailwind CSS**: define cores, tamanhos e layout por meio de classes como `rounded-3xl` ou `lg:grid`. O prefixo `lg:` significa "só em telas grandes".
- **Vitest**: roda testes automáticos que conferem se a lógica continua certa (`npm test`).
- **Git / GitHub / Vercel**: o Git guarda o histórico de versões, o GitHub guarda o código online (é o que recrutadores veem) e a Vercel publica o site de graça.

**Sem backend (servidor próprio):** o app roda inteiro no navegador e conversa direto com as APIs gratuitas. Isso mantém custo zero e simplicidade. Só seria necessário um servidor para notificações push, que ficaram fora do escopo.

---

## 6. Fontes de dados

| Necessidade | Fonte | Observações |
|---|---|---|
| Clima atual e previsão | **Open-Meteo** (Forecast API) | Gratuita para uso não comercial, sem chave de API, cobertura mundial |
| Busca de cidades | **Open-Meteo** (Geocoding API) | Suporta nomes em português |
| Histórico | **Open-Meteo** (Historical Weather API) | Dados desde 1940 |
| Qualidade do ar | **Open-Meteo** (Air Quality API) | AQI, PM2.5, PM10, ozônio etc. |
| Nome do local a partir do GPS ou de um clique no mapa | **Nominatim (OpenStreetMap)** ou similar gratuito | O Open-Meteo não converte coordenadas em nome de cidade. Respeitar o limite de 1 requisição por segundo |
| Radar de chuva | **RainViewer** ou similar | Verificar as condições atuais do plano gratuito antes de implementar |
| Alertas oficiais | **A definir** | O Open-Meteo não fornece alertas. Ver decisões em aberto (seção 11) |

> Atenção: o Open-Meteo exige **citar a fonte** no app (ex.: "Dados: Open-Meteo.com"). O OpenStreetMap também exige atribuição no mapa.

---

## 7. Requisitos de interface e experiência

### Responsividade (requisito central)
- Abordagem **mobile-first**: desenhar primeiro para celular e depois expandir para telas maiores
- Funcionar bem de **320 px** de largura (celulares pequenos) até monitores largos
- **Celular:** uma coluna, rolagem vertical, botões grandes para o dedo (mínimo de 44 px)
- **Tablet:** duas colunas de cartões
- **Desktop:** layout em grade aproveitando a largura, com mapa e gráficos maiores
- Nada pode exigir rolagem horizontal da página. Listas como a previsão hora a hora podem rolar para o lado dentro do próprio cartão

### Visual
- **Dinâmico pelo clima:** fundo e cores mudam conforme a condição e a hora local da cidade (céu azul de dia, tons escuros à noite, cinza na chuva, tons quentes no pôr do sol)
- Ícones de clima claros e consistentes (preferencialmente animados de forma sutil)
- **Tema claro/escuro automático**, seguindo o aparelho, com botão para trocar manualmente
- Respeitar a configuração "reduzir movimento" do sistema (desligar animações)

### Acessibilidade
- Contraste de texto suficiente sobre todos os fundos dinâmicos
- Navegação completa pelo teclado
- Textos alternativos em ícones (ex.: leitor de tela fala "chuva forte", não "ícone")
- Nunca usar **só cor** para passar informação (ex.: AQI ruim tem cor **e** texto)

### Desempenho e offline
- Carregamento rápido mesmo no 4G
- Guardar os últimos dados consultados para exibir **sem internet**, indicando "atualizado há X minutos"
- Evitar consultas repetidas às APIs (cache de alguns minutos)

---

## 8. Escopo por fases

### Fase 1: MVP (primeira versão publicada)
- [x] Clima atual com todos os dados da seção 3.1
- [x] Previsão hora a hora (48 h)
- [x] Previsão de 7 dias
- [x] Probabilidade + volume de chuva
- [x] Busca por cidade
- [x] Localização por GPS
- [x] Layout responsivo (celular, tablet, desktop)
- [x] Visual dinâmico pelo clima + tema claro/escuro
- [x] Publicado na Vercel com link público: https://aurora-six-rho.vercel.app/

### Fase 2: Personalização
- [ ] Cidades favoritas
- [ ] Português/inglês
- [ ] Unidades alternáveis
- [ ] Gráficos interativos
- [ ] Qualidade do ar

### Fase 3: App instalável
- [ ] PWA (instalar na tela inicial)
- [ ] Funcionamento offline com os últimos dados

### Fase 4: Mapas e dados avançados
- [ ] Mapa interativo com clique para escolher local
- [ ] Camadas de radar/nuvens
- [ ] Histórico e comparação com a média
- [ ] Previsão estendida (16 dias)
- [ ] Alertas meteorológicos

### Fase 5: Acabamento de portfólio
- [ ] README com prints, GIF de demonstração e explicação técnica
- [ ] Testes automatizados das partes principais
- [ ] Auditoria de desempenho e acessibilidade (Lighthouse com nota alta)

---

## 9. Fora do escopo (por enquanto)
- Login/contas de usuário
- Notificações push (exigiriam servidor próprio)
- App nativo para lojas (Play Store/App Store). O PWA cobre a necessidade
- Uso comercial (mudaria as regras de uso do Open-Meteo)
- Medição própria de clima (estações, sensores)

---

## 10. Sugestões de nome

Nomes que funcionam em português **e** em inglês:

| Nome | Ideia |
|---|---|
| **Nimbo** | De *nimbus*, a nuvem de chuva. Curto e fácil de lembrar |
| **Brisa** | Leve e simpático; pronunciável em inglês |
| **Isóbara** / **Isobar** | Linhas de mesma pressão nos mapas de tempo. Soa técnico |
| **Céu Aberto** / **OpenSky** | Expressão comum e otimista |
| **Zênite** / **Zenith** | O ponto mais alto do céu |
| **Aurora** | Bonito, mas já é bastante usado |

> Antes de decidir, verifique se o nome está livre no GitHub e como domínio `.vercel.app`.

---

## 11. Decisões em aberto

| # | Questão | Opções / próximos passos |
|---|---|---|
| 1 | ~~Nome do app~~ | ✅ Decidido: **Aurora** |
| 2 | **Fonte de alertas oficiais** | Não existe uma fonte gratuita única e mundial. Opções: INMET (Brasil), NWS (EUA), MeteoAlarm (Europa), ou mostrar alertas apenas dessas regiões. Decidir na Fase 4 |
| 3 | **Fonte do radar** | Confirmar as condições atuais do plano gratuito do RainViewer ou buscar alternativa |
| 4 | ~~Biblioteca de ícones de clima~~ | ✅ Decidido: **Meteocons** (MIT), versões animada e estática em `public/icons/` |
| 5 | **Escala de AQI** | Europeia ou americana (EUA)? O Open-Meteo oferece as duas |

---

## 12. Premissas e restrições (resumo)

1. Custo **zero**: só serviços gratuitos.
2. Funciona em **qualquer tamanho de tela**, com abordagem mobile-first.
3. **Sem servidor próprio**: tudo roda no navegador.
4. **Sem login**: preferências ficam salvas no aparelho.
5. Código e visual com **qualidade de portfólio**.
6. O autor é **iniciante**: priorizar soluções simples, código comentado e explicações a cada etapa.
7. Sempre **citar as fontes** dos dados (Open-Meteo, OpenStreetMap etc.).
