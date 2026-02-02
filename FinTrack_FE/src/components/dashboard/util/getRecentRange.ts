function getRecentRange(){
    const today = new Date();

    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 6); // 오늘 포함 7일

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const startDate = 
        sevenDaysAgo > monthStart ? sevenDaysAgo : monthStart;

    return {startDate, endDate: today};
}

export default getRecentRange;