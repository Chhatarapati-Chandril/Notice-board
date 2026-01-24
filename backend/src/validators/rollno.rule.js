const normalizeRollNo = (roll_no) => {
    if (typeof roll_no !== "string") return null;

    const normalized = roll_no.trim();
    const regex = /^\d{8}$/;

    return regex.test(normalized) ? normalized : null;
};

export default normalizeRollNo;
