function isValidRNDependency(config: any) {
  return (
    Object.keys(config.platforms).filter((key) =>
      Boolean(config.platforms[key])
    ).length !== 0
  );
}
function filterConfig(config: any) {
  const filtered = {
    ...config,
  };
  Object.keys(filtered.dependencies).forEach((item) => {
    if (!isValidRNDependency(filtered.dependencies[item])) {
      delete filtered.dependencies[item];
    }
  });
  return filtered;
}

function plugin(
  argv: Array<string>,
  config: {
    dependencies: {
      [key: string]: Function;
    };
  },
  args: {
    exclude?: string[];
  }
) {
  const dependencies = Object.fromEntries(
    Object.entries(config.dependencies).filter(
      ([key]) => args.exclude && !args.exclude.includes(key)
    )
  );
  config.dependencies = dependencies;

  console.log(JSON.stringify(filterConfig(config), null, 2));
}

function parseExclude(value?: string) {
  return value?.split(",") ?? [];
}

export const commands = [
  {
    name: "app-clip",
    func: plugin,
    options: [{ name: "--exclude <exclude>", parse: parseExclude }],
  },
];
