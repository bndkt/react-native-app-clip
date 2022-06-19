import withIosAppClip, {
  WithIosAppClipConfigPluginProps,
} from "../src/withIosAppClip";

const exp = { name: "foo", slug: "bar" };

const props: WithIosAppClipConfigPluginProps = {
  entryPoint: "index.appclip.js",
  name: "RN App Clip",
};

describe(withIosAppClip, () => {
  it("should not throw when options are valid", () => {
    expect(() => withIosAppClip(exp, props)).not.toThrow();
  });
  it("should not throw when no options are provided", () => {
    expect(() => withIosAppClip(exp, {})).not.toThrow();
  });
});
