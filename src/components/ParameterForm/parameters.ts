enum ParameterType {
  TEXT = 'text',
  NUMBER = 'number',
  CHECKBOX = 'checkbox',
  RANGE = 'range',
}

enum ParameterCategory {
  GENERAL = 'General',
  OTHER = 'Other',
}

export type ParameterDefinition = {
  name: string;
  label: string;
  description?: string;
  type: ParameterType;
  category: ParameterCategory;
  placeholder?: string;
  suffix?: string;
};

const parameters: ParameterDefinition[] = [
  {
    name: 'device',
    label: 'Device',
    placeholder: 'Device identifier',
    type: ParameterType.TEXT,
    category: ParameterCategory.OTHER,
  },
  {
    name: 'wait_for_device',
    label: 'Wait For Device',
    type: ParameterType.CHECKBOX,
    category: ParameterCategory.GENERAL,
  },
  {
    name: 'app_id',
    label: 'App ID',
    placeholder: 'com.instagram.android',
    type: ParameterType.TEXT,
    category: ParameterCategory.GENERAL,
  },
  {
    name: 'old',
    label: 'Old UIAutomator',
    placeholder: '',
    type: ParameterType.CHECKBOX,
    category: ParameterCategory.GENERAL,
  },
  {
    name: 'dont_indicate_softban',
    label: "Don't Indicate Softban",
    type: ParameterType.CHECKBOX,
    category: ParameterCategory.GENERAL,
  },
  {
    name: 'debug',
    label: 'Debug',
    type: ParameterType.CHECKBOX,
    category: ParameterCategory.GENERAL,
  },
  {
    name: 'no_speed_check',
    label: 'Skip Speed Check',
    type: ParameterType.CHECKBOX,
    category: ParameterCategory.GENERAL,
  },
  {
    name: 'next_config_file',
    label: 'Next Config File',
    placeholder: 'For running multiple sessions',
    type: ParameterType.TEXT,
    category: ParameterCategory.GENERAL,
  },
  {
    name: 'username',
    label: 'Username',
    placeholder: 'For when you have multiple accounts',
    type: ParameterType.TEXT,
    category: ParameterCategory.GENERAL,
  },
  {
    name: 'recheck_follow_status_after',
    label: 'Recheck Follow Status After:',
    placeholder: '0',
    type: ParameterType.TEXT,
    category: ParameterCategory.GENERAL,
    suffix: 'Hours',
  },
  {
    name: 'repeat',
    label: 'Repeat After:',
    placeholder: '0',
    type: ParameterType.TEXT,
    category: ParameterCategory.GENERAL,
    suffix: 'Hours',
  },
  // {
  //   name: 'username',
  //   label: 'Username',
  //   placeholder: 'For when you have multiple accounts',
  //   type: ParameterType.TEXT,
  //   category: ParameterCategory.GENERAL,
  // },
  // {
  //   name: 'username',
  //   label: 'Username',
  //   placeholder: 'For when you have multiple accounts',
  //   type: ParameterType.TEXT,
  //   category: ParameterCategory.GENERAL,
  // },
];

const categoryOrder: ParameterCategory[] = [ParameterCategory.GENERAL, ParameterCategory.OTHER];

export const categories = parameters
  .reduce((categories: ParameterCategory[], param) => {
    if (categories.indexOf(param.category) === -1) {
      return [...categories, param.category];
    }
    return categories;
  }, [])
  .sort((catA, catB) => {
    let orderA = categoryOrder.indexOf(catA);
    if (orderA === -1) {
      orderA = Number.MAX_VALUE;
    }
    let orderB = categoryOrder.indexOf(catB);

    if (orderB === -1) {
      orderB = Number.MAX_VALUE;
    }
    return orderA - orderB;
  });

export default parameters;
