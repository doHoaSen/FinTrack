function getRecentRange(){
    const today = new Date();

    // 오늘 00:00:00 (시간 성분 제거)
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // 오늘 23:59:59.999 (하루 끝)
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);

    // 6일 전 00:00:00 (오늘 포함 7일)
    const sevenDaysAgo = new Date(todayStart);
    sevenDaysAgo.setDate(todayStart.getDate() - 6);

    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

    const startDate = sevenDaysAgo > monthStart ? sevenDaysAgo : monthStart;

    return {startDate, endDate};
}

export default getRecentRange;