# Reports Overview

Updated: August 28, 2026

## EN

### Summary

This update introduces the first standalone Reports experience, with reusable UI blocks for report sections, KPI summaries, signal lists, social/context cards, and a new ECharts-based trend chart.

### Component count

- Added: 11 component families
- Changed: 4 existing items

Added component families:

1. `ReportsMultiSeriesLineChart`
2. `Metric1`
3. `ReportHeading`
4. `ReportSection`
5. `SocialCard`
6. `StatusListCard`
7. `StatusListItem`
8. `CopyButton`
9. `FrameCard`
10. `EChartsLineChart`
11. `EChartsShipmentsLineChart`

Changed existing items:

1. `Reports` page
2. `App` routing/rendering flow
3. `Badge`
4. `ReportsCalendar` moved into the new Reports feature structure

### What was delivered

- A dedicated Reports page with its own full-page layout and scroll behavior.
- Reusable report content blocks to standardize headings, sections, metrics, and lists.
- A new line-chart foundation in ECharts for weekly comparisons and future analytics views.
- Shared UI improvements, including a framed card pattern, expanded badge support, and a copy-link action.
- A typography fix so Geist can load correctly across the app in production.

### PM framing

This release delivers the first complete Reports surface and sets up reusable foundations for future reporting and analytics features.

## PT

### Resumo

Esta atualização entrega a primeira experiência standalone de Reports, com blocos reutilizáveis para seções do relatório, KPIs, listas de sinais, cards sociais/contextuais e um novo gráfico de tendência com ECharts.

### Quantidade de componentes

- Adicionados: 11 famílias de componentes
- Alterados: 4 itens existentes

Famílias de componentes adicionadas:

1. `ReportsMultiSeriesLineChart`
2. `Metric1`
3. `ReportHeading`
4. `ReportSection`
5. `SocialCard`
6. `StatusListCard`
7. `StatusListItem`
8. `CopyButton`
9. `FrameCard`
10. `EChartsLineChart`
11. `EChartsShipmentsLineChart`

Itens existentes alterados:

1. Página `Reports`
2. Fluxo de roteamento/renderização em `App`
3. `Badge`
4. `ReportsCalendar` movido para a nova estrutura da feature de Reports

### O que foi entregue

- Uma página de Reports dedicada, com layout próprio e comportamento de scroll independente.
- Blocos reutilizáveis para padronizar headings, seções, métricas e listas do relatório.
- Uma nova base de gráfico de linha em ECharts para comparações semanais e futuras visões analíticas.
- Melhorias de UI compartilhada, incluindo o padrão de card com moldura, expansão do `Badge` e ação de copiar link.
- Correção de tipografia para o Geist carregar corretamente em produção em toda a aplicação.

### Sugestão de framing para PM

Esta entrega lança a primeira versão completa da superfície de Reports e cria bases reutilizáveis para futuras funcionalidades de reporting e analytics.
