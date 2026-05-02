# Hermes Estimate API Contract

## POST /estimate

### Required fields

- `article_name`
- `unit_label`
- `mode`
- `scope_type`

### Optional arrays

- `materials`
- `transport`
- `energy`

### Business rules

- Maximum one primary MCP call
- Maximum one fallback
- No web search
- No invented factor
- Missing data must be rendered as `NON FOURNI / A CONFIRMER`
