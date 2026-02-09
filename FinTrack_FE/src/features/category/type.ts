export type Category = {
    id: number;
    name: string;
    type: "FIXED" | "VARIABLE";
    isDefault: boolean;
}