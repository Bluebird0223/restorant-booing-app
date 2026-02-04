const generateSlots = (opening, closing) => {
    const slots = [];
    let current = new Date(opening);

    while (current < closing) {
        const end = new Date(current);
        end.setHours(end.getHours() + 1);

        slots.push({
            start: new Date(current),
            end
        });

        current = end;
    }

    return slots;
};
