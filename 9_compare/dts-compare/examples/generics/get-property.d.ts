export = GetProperty

declare function GetProperty<T, K extends keyof T>(obj: T, key: K);