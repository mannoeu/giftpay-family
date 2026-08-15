import { useSheet } from "@/store/sheet";

describe("useSheet", () => {
  beforeEach(() => {
    useSheet.setState({
      content: null,
      isVisible: false,
      snapPoints: undefined,
      enablePanDownToClose: undefined,
      locked: false,
    });
  });

  it("openSheet com locked impede outro openSheet sem force", () => {
    const first = <></>;
    const second = <></>;

    useSheet.getState().openSheet(first, { locked: true });
    const replaced = useSheet.getState().openSheet(second);

    expect(replaced).toBe(false);
    expect(useSheet.getState().content).toBe(first);
    expect(useSheet.getState().locked).toBe(true);
  });

  it("openSheet com force substitui sheet locked", () => {
    const first = <></>;
    const second = <></>;

    useSheet.getState().openSheet(first, { locked: true });
    const replaced = useSheet.getState().openSheet(second, {
      locked: true,
      force: true,
    });

    expect(replaced).toBe(true);
    expect(useSheet.getState().content).toBe(second);
  });

  it("closeSheet limpa locked", () => {
    useSheet.getState().openSheet(<></>, { locked: true });
    useSheet.getState().closeSheet();

    expect(useSheet.getState().isVisible).toBe(false);
    expect(useSheet.getState().locked).toBe(false);
  });
});
