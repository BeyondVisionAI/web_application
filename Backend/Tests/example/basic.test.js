

var toto = "";

//First function of the file
beforeAll(() => {
    toto = "toto";
})

//Group of tests
describe('Check if order is good', () => {
    it('Should be toto', () => {
        expect(toto).toBe("tata");
    });
    it('Should be tata', () => {
        expect(toto).toBe("tata");
    });
    //After each test of this describe, we change toto value (see 'Should be tata')
    afterEach(() => {
        toto = "tata";
    });
});

//Group of tests
describe('Comparaison', () => {
    it("json", () => {
        const json = {
            name: "hello",
            age: 12
        };
        expect(typeof json.name).toBe("string");
        expect(typeof json.age).toBe("number");
        expect(json).toStrictEqual({name: 'hello', age: 12});
    })
});