export const primary = 'anthropic/claude-sonnet-4.6';
const orderdefault = ['bedrock', 'anthropic'];

function order() {
  const value = process.env.TIGENT_GATEWAY_ORDER?.trim();

  if (!value) {
    return orderdefault;
  }

  const items = value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);

  return items.length > 0 ? items : orderdefault;
}

export function call(model: string) {
  if (model === primary) {
    return {
      model,
      providerOptions: {
        gateway: {
          order: order(),
        },
      },
    };
  }

  return { model };
}

export function label(model: string) {
  if (model === primary) {
    return 'sonnet 4.6';
  }

  const parts = model.split('/');
  return parts[parts.length - 1] || model;
}
