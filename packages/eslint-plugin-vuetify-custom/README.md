# eslint-plugin-vuetify-custom

Правила ESLint для шаблонов **Vue 3** в связке с **`@dimailn/vuetify`** (монорепо). Не npm-версия `eslint-plugin-vuetify`: префикс правил `vuetify-custom/*`.

## Зачем

- **Сетка:** `grid-unknown-attributes` знает допустимые пропы `v-container` / `v-row` / `v-col` даже **без** собранного `es5/` (статический снимок в `lib/data/grid-known-props.js`). Если установлен пакет со сборкой, подхватываются пропы из `options.props` компонентов.
- **Миграция со старой сетки:** `no-legacy-grid` — старые теги/атрибуты (`VLayout`, классы `xs12` и т.д.).
- **Устаревшие компоненты/классы/пропы:** правила из форка v1; карты могут быть неполными под ваш форк — в пресете `base` они стоят как **`warn`**, не `error`.

Общие проверки Vue 3 (`emits`, `v-model`, и т.д.) — это **`eslint-plugin-vue`**, не этот пакет.

## Пресеты

| Конфиг | Содержимое |
|--------|------------|
| `plugin:vuetify-custom/base` | `vue/valid-v-slot`, три `no-deprecated-*` → **warn** |
| `plugin:vuetify-custom/recommended` | base + `no-legacy-grid` + `grid-unknown-attributes` → **error** |

## Поддержка в актуальном состоянии

При изменении `packages/vuetify/src/components/VGrid/*.ts` обновите **`lib/data/grid-known-props.js`** (комментарий в файле).

## Peer

- `eslint` ^8
- `eslint-plugin-vue` ^8 || ^9
