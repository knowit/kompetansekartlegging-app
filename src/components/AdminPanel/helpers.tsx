const getAttribute = (user: any, attribute: string): string | undefined =>
    user?.Attributes?.find((attr: any) => attr.Name === attribute)?.Value;

const not = (a: any, b: any) =>
    a.filter((av: any) => !b.some((bv: any) => bv.Username === av.Username));

const compareByName = (a: any, b: any) => {
    const aName = getAttribute(a, "name");
    const bName = getAttribute(b, "name");
    if (!aName) return 1;
    if (!bName) return -1;
    return aName.localeCompare(bName);
};

const compareByIndex = (a: any, b: any) => {
    if (!a.index) return 1;
    if (!b.index) return -1;
    return a.index - b.index;
};

const compareByCreatedAt = (a: any, b: any) =>
    Date.parse(a.createdAt) > Date.parse(b.createdAt) ? -1 : 1;

export { getAttribute, not, compareByName, compareByIndex, compareByCreatedAt };
