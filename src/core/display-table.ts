export const displayTable = <T extends object>(data: T[], model: T) => {
    if (data.length === 0) return

    const headers = Object.keys(model);
    const columnWidth = 20;

        
    const divider = "+" + headers.map(() => "-".repeat(columnWidth + 2)).join("+") + "+";

    const headerRow = "| " + headers
        .map((header) => header.toUpperCase().padEnd(columnWidth))
        .join(" | ") + " |";

    console.log(divider)
    console.log(headerRow)
    console.log(divider)
    
    data.forEach((item) => {
        const row = "| " + headers
        .map((header) => String(item[header as keyof T] ?? "").padEnd(columnWidth))
        .join(' | ') + " |";
        console.log(row)
    })

    console.log(divider)

    console.log(`Page: 1 of ${Math.ceil(data.length / 5)}`)
    console.log(`Total friends: ${data.length}`)
}
