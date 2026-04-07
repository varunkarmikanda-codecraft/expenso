export const displayTable = <T extends object>(data: T[], model: T, currentPage: number, limit: number = 5) => {
    if (data.length === 0) return

    console.clear();

    const totalPages = Math.ceil(data.length / limit);
    const startIndex = (currentPage - 1) * limit;
    const currentPageData = data.slice(startIndex, startIndex + limit);

    const headers = Object.keys(model);
    const columnWidth = 20;

        
    const divider = "+" + headers.map(() => "-".repeat(columnWidth + 2)).join("+") + "+";

    const headerRow = "| " + headers
        .map((header) => header.toUpperCase().padEnd(columnWidth))
        .join(" | ") + " |";

    console.log(divider)
    console.log(headerRow)
    console.log(divider)
    
    currentPageData.forEach((item) => {
        const row = "| " + headers
        .map((header) => String(item[header as keyof T] ?? "").padEnd(columnWidth))
        .join(' | ') + " |";
        console.log(row)
    })

    console.log(divider)

    const prev = currentPage > 1 ? '< PREV' : '      ';
    const next = currentPage < totalPages ? 'NEXT >' : '      ';
    const esc = '[ESC] to Exit';

    console.log(`Page: ${currentPage} of ${totalPages} | Total friends: ${data.length}`);
    console.log(`\n${prev.padEnd(columnWidth *2)}          ${esc.padEnd(columnWidth * 2)}          ${next}\n`);
}
