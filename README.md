# Aurora

Aplicativo web de previsão do tempo para qualquer cidade do mundo, feito para funcionar bem em qualquer tela, do celular ao monitor.

**🌐 Acesse: [aurora-six-rho.vercel.app](https://aurora-six-rho.vercel.app/)**

> 🚧 Em desenvolvimento: Fase 1 (MVP) concluída. Veja o planejamento completo em [PROJETO.md](PROJETO.md).

## Funcionalidades

- **Clima agora:** temperatura, sensação térmica, umidade, ponto de orvalho, vento e rajadas, índice UV, pressão, visibilidade, nascer e pôr do sol. Cada dado vem com uma dica em linguagem simples (ex.: "Ar seco", "UV alto").
- **Previsão hora a hora** para as próximas 48 horas e **previsão de 7 dias**, sempre mostrando a chance de chuva (%) junto com a quantidade (mm).
- **Busca de cidades** com sugestões enquanto você digita, e **localização por GPS**.
- **Fundo dinâmico:** as cores mudam conforme o tempo e a hora local da cidade (dia, noite, amanhecer, pôr do sol, chuva, tempestade...).
- **Tema claro/escuro** automático, com botão para trocar.
- **Acessível:** navegação por teclado, textos para leitores de tela e animações desligadas quando o sistema pede "reduzir movimento".

## Tecnologias

| | |
|---|---|
| Interface | [React 19](https://react.dev) + [TypeScript](https://www.typescriptlang.org) |
| Build | [Vite](https://vite.dev) |
| Estilos | [Tailwind CSS 4](https://tailwindcss.com) |
| Testes | [Vitest](https://vitest.dev) |
| Dados do clima | [Open-Meteo](https://open-meteo.com) (gratuita, sem chave) |
| Nome da cidade pelo GPS | [Nominatim / OpenStreetMap](https://nominatim.org) |
| Ícones | [Meteocons](https://github.com/basmilius/weather-icons), de Bas Milius (MIT) |

## Como rodar no seu computador

Pré-requisito: [Node.js](https://nodejs.org) 20 ou mais recente.

```bash
npm install      # baixa as bibliotecas (só na primeira vez)
npm run dev      # liga o app em http://localhost:5173
```

Outros comandos:

```bash
npm test         # roda os testes automáticos
npm run build    # gera a versão final na pasta dist/
npm run lint     # verifica a qualidade do código
```

## Organização do código

```
src/
  api/         comunicação com Open-Meteo e Nominatim
  lib/         lógica pura: códigos de clima, formatação, cenário do fundo
  hooks/       estado do app: previsão, GPS, tema
  components/  partes da tela (busca, cartões de clima, rodapé...)
public/icons/  ícones de clima (animados e estáticos)
```

## Créditos

Dados meteorológicos: [Open-Meteo.com](https://open-meteo.com/) (CC BY 4.0). Geocodificação reversa: © colaboradores do [OpenStreetMap](https://www.openstreetmap.org/copyright). Ícones: [Meteocons](https://github.com/basmilius/weather-icons) (MIT).
