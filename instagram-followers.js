/**
 * Instagram Follower/Following Analyzer
 * @author    Berkay Yurur
 * @version    1.5.0 (Parallel Fetch & Adaptive Jitter)
 */

(async () => {
    // Performans için optimize edilmiş, değişken gecikmeler (Jitter)
    const DELAY = {
        min: 600,
        max: 1200,
        batchPause: 5000, // 10 istekte bir kısa nefes
        batchSize: 10
    };

    // Rastgele gecikme fonksiyonu (Bot algısını azaltır)
    const sleep = (ms) => new Promise(res => setTimeout(res, ms || (Math.random() * (DELAY.max - DELAY.min) + DELAY.min)));

    const style = document.createElement('style');
    style.textContent = `
        .ig-container { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #000; color: #fff; font-family: -apple-system, sans-serif; z-index: 99999; padding: 20px; overflow: auto; }
        .ig-sidebar { position: fixed; left: 20px; top: 80px; width: 220px; background: #121212; padding: 15px; border-radius: 8px; border: 1px solid #262626; }
        .ig-main { margin-left: 260px; }
        .ig-button { display: block; width: 100%; padding: 10px; margin: 5px 0; background: #0095f6; border: none; border-radius: 4px; color: white; cursor: pointer; font-weight: 600; text-align: center; }
        .ig-button:disabled { opacity: 0.5; cursor: not-allowed; }
        .ig-progress { background: #121212; padding: 15px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #262626; }
        .ig-filter-box { background: #1a1a1a; padding: 10px; margin: 10px 0; border-radius: 6px; border: 1px solid #333; font-size: 12px; }
        .ig-user-item { display: grid; grid-template-columns: 30px 44px 1fr 140px; gap: 12px; align-items: center; padding: 12px; border-bottom: 1px solid #262626; }
        .ig-user-avatar { width: 44px; height: 44px; border-radius: 50%; }
        .ig-username { color: #fff; font-weight: 600; text-decoration: none; }
        .ig-badge { background: #0095f6; color: white; padding: 2px 5px; border-radius: 3px; font-size: 10px; }
    `;
    document.head.appendChild(style);

    let followers = [];
    let following = [];
    let currentDataInView = [];
    let currentTitleInView = "";

    const fetchAll = async (userId, isFollowers, totalCount) => {
        let items = [];
        let after = null;
        let count = 0;

        while (true) {
            const queryHash = isFollowers ? '37479f2b8209594dde7facb0d904896a' : 'd04b0a864b4b54837c0d870b0e77e076';
            const variables = encodeURIComponent(JSON.stringify({ id: userId, first: 50, after }));
            
            try {
                const res = await fetch(`https://www.instagram.com/graphql/query/?query_hash=${queryHash}&variables=${variables}`, {
                    headers: { 'X-IG-App-ID': '936619743392459' }
                });
                const json = await res.json();
                const data = isFollowers ? json.data.user.edge_followed_by : json.data.user.edge_follow;
                
                const batch = data.edges.map(e => ({
                    id: e.node.id,
                    username: e.node.username,
                    fullName: e.node.full_name,
                    isVerified: !!e.node.is_verified,
                    // ÖNEMLİ: is_private bazen node altında değil, user objesi altında gelebilir
                    isPrivate: e.node.is_private ?? e.node.is_private_account ?? (e.node.user ? e.node.user.is_private : false),
                    profilePic: e.node.profile_pic_url
                }));

                items.push(...batch);
                updateUIProgress(isFollowers, items.length, totalCount);

                if (!data.page_info.has_next_page) break;
                after = data.page_info.end_cursor;
                count++;

                // Hız Ayarı: Her 10 istekte bir daha uzun bekle, diğerlerinde kısa/rastgele bekle
                if (count % DELAY.batchSize === 0) await sleep(DELAY.batchPause);
                else await sleep();

            } catch (err) {
                console.error("Fetch hatası, 5sn sonra tekrar deneniyor...", err);
                await sleep(5000);
            }
        }
        return items.sort((a, b) => a.username.localeCompare(b.username));
    };

    const updateUIProgress = (isF, cur, tot) => {
        const id = isF ? 'prog-fol' : 'prog-foll';
        let el = document.getElementById(id);
        if(!el) {
            el = document.createElement('div'); el.id = id;
            document.querySelector('.ig-progress').appendChild(el);
        }
        el.innerHTML = `${isF ? 'Takipçiler' : 'Takip Edilenler'}: %${((cur/tot)*100).toFixed(1)} (${cur}/${tot})`;
    };

    const showUsers = (users, title) => {
        currentDataInView = users;
        currentTitleInView = title;

        const hidePrivateFol = document.getElementById('hidePrivateFollowers').checked;
        const hidePrivateFoll = document.getElementById('hidePrivateFollowing').checked;

        let filtered = users;
        if (title === "Takipçiler" && hidePrivateFol) filtered = users.filter(u => !u.isPrivate);
        if ((title === "Takip Edilenler" || title.includes("Etmeyenler")) && hidePrivateFoll) filtered = users.filter(u => !u.isPrivate);

        const mainDiv = document.querySelector('.ig-main');
        mainDiv.innerHTML = `
            <h3>${title} (${filtered.length})</h3>
            <div class="ig-results">
                ${filtered.map(u => `
                    <div class="ig-user-item">
                        <input type="checkbox" class="ig-checkbox" data-userid="${u.id}">
                        <img class="ig-user-avatar" src="${u.profilePic}">
                        <div>
                            <a class="ig-username" href="https://instagram.com/${u.username}" target="_blank">${u.username} ${u.isVerified ? '<span class="ig-badge">✓</span>' : ''}</a>
                            <div style="font-size:12px; color:#8e8e8e;">${u.fullName || ''} ${u.isPrivate ? '🔒' : ''}</div>
                        </div>
                        <button class="ig-button" onclick="this.disabled=true; unfollow('${u.id}', this)" style="height:30px; padding:0; font-size:11px;">Takipten Çık</button>
                    </div>
                `).join('')}
            </div>
        `;
    };

    // Ana Arayüz
    const container = document.createElement('div');
    container.className = 'ig-container';
    container.innerHTML = `
        <div class="ig-sidebar">
            <button class="ig-button" id="start">Analizi Başlat</button>
            <div class="ig-filter-box">
                <label><input type="checkbox" id="hidePrivateFollowers"> Gizli Takipçileri Gizle</label><br>
                <label><input type="checkbox" id="hidePrivateFollowing"> Gizli Takip Edilenleri Gizle</label>
            </div>
            <button class="ig-button" id="btnFol" disabled>Takipçiler</button>
            <button class="ig-button" id="btnFoll" disabled>Takip Edilenler</button>
            <button class="ig-button" id="btnNot" disabled>Takip Etmeyenler</button>
        </div>
        <div class="ig-main"><div class="ig-progress">Kullanıcı adınızı girip başlatın...</div></div>
    `;
    document.body.appendChild(container);

    document.getElementById('start').onclick = async () => {
        const user = prompt("Kullanıcı Adınız:");
        if(!user) return;
        
        const res = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${user}`, {
            headers: { 'X-IG-App-ID': '936619743392459' }
        });
        const json = await res.json();
        const u = json.data.user;

        document.getElementById('start').disabled = true;
        document.getElementById('start').innerText = "Veriler Çekiliyor...";

        // PARALEL ÇALIŞTIRMA (Hızın anahtarı burada)
        const [fol, foll] = await Promise.all([
            fetchAll(u.id, true, u.edge_followed_by.count),
            fetchAll(u.id, false, u.edge_follow.count)
        ]);

        followers = fol; following = foll;
        
        document.getElementById('btnFol').disabled = false;
        document.getElementById('btnFoll').disabled = false;
        document.getElementById('btnNot').disabled = false;
        document.getElementById('start').innerText = "Analiz Tamam!";
        showUsers(following, "Takip Edilenler");
    };

    document.getElementById('btnFol').onclick = () => showUsers(followers, "Takipçiler");
    document.getElementById('btnFoll').onclick = () => showUsers(following, "Takip Edilenler");
    document.getElementById('btnNot').onclick = () => {
        const list = following.filter(f => !followers.some(fol => fol.username === f.username));
        showUsers(list, "Sizi Takip Etmeyenler");
    };

    // Filtre değişince listeyi anında güncelle
    document.getElementById('hidePrivateFollowers').onchange = () => showUsers(currentDataInView, currentTitleInView);
    document.getElementById('hidePrivateFollowing').onchange = () => showUsers(currentDataInView, currentTitleInView);

})();