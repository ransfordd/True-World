// Daily Truth Generator
(function() {
    const truths = [
        { text: "Your identity is not found in what you do, but in who you are in the Spirit.", ref: "Identity Truth" },
        { text: "True awakening begins when you see beyond the veil of religious tradition.", ref: "Spiritual Insight" },
        { text: "The Kingdom operates in power, not just in words.", ref: "Kingdom Principle" },
        { text: "Your spiritual DNA carries the seeds of divine purpose.", ref: "Purpose Reality" },
        { text: "Walking in truth requires both revelation and application.", ref: "Walking in Truth" },
        { text: "The prophetic opens doors that religion has sealed shut.", ref: "Prophetic Truth" },
        { text: "Your breakthrough is tied to your level of spiritual perception.", ref: "Breakthrough Key" }
    ];

    function getDailyTruth() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24));
        const truthIndex = dayOfYear % truths.length;
        return truths[truthIndex];
    }

    function updateDailyTruth() {
        const truth = getDailyTruth();
        const date = new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric'
        });

        const truthDateEl = document.getElementById('truthDate');
        const truthTextEl = document.getElementById('truthText');
        const truthReferenceEl = document.getElementById('truthReference');

        if (truthDateEl) truthDateEl.textContent = date;
        if (truthTextEl) truthTextEl.textContent = `"${truth.text}"`;
        if (truthReferenceEl) truthReferenceEl.textContent = truth.ref;
    }

    // Update immediately and then at midnight
    updateDailyTruth();
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    setTimeout(() => {
        updateDailyTruth();
        // Then update every 24 hours
        setInterval(updateDailyTruth, 24 * 60 * 60 * 1000);
    }, tomorrow - new Date());
})();

