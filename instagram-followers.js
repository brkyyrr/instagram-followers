/**
 * Instagram Follower/Following Analyzer
 * @author    Berkay Yurur
 * @version    1.8.1 (Güvenli Toplu İşlem & Gelişmiş UI)
 */

(async () => {
    // GÜVENLİK AYARLARI (Örnek koddaki insansı bekleme süreleri baz alındı)
    const DELAY = {
        fetch_min: 600,
        fetch_max: 1200,
        fetch_batch_pause: 5000,
        fetch_batch_size: 10,
        
        unfollow_min: 25000, // 25 saniye
        unfollow_max: 45000, // 45 saniye
        unfollow_batch_size: 5,
        unfollow_long_pause: 300000 // 5 dakika mola
    };

    const sleep = (ms) => new Promise(res => setTimeout(res, ms || (Math.random() * (DELAY.fetch_max - DELAY.fetch_min) + DELAY.fetch_min)));
    const sleepRandom = (min, max) => new Promise(res => setTimeout(res, Math.random() * (max - min) + min));

    const style = document.createElement('style');
    style.textContent = `
        .ig-container { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #000; color: #fff; font-family: -apple-system, sans-serif; z-index: 99999; padding: 20px; overflow: auto; }
        .ig-sidebar { position: fixed; left: 20px; top: 80px; width: 220px; background: #121212; padding: 15px; border-radius: 8px; border: 1px solid #262626; z-index: 100; }
        .ig-main { margin-left: 260px; }
        .ig-button { display: block; width: 100%; padding: 10px; margin: 5px 0; background: #0095f6; border: none; border-radius: 4px; color: white; cursor: pointer; font-weight: 600; text-align: center; }
        .ig-button:disabled { opacity: 0.5; cursor: not-allowed; }
        .ig-progress { background: #121212; padding: 15px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #262626; font-size: 13px; line-height: 1.5; min-height: 20px; }
        .ig-filter-box { background: #1a1a1a; padding: 10px; margin: 10px 0; border-radius: 6px; border: 1px solid #333; font-size: 12px; }
        .ig-user-item { display: grid; grid-template-columns: 30px 44px 1fr 140px; gap: 12px; align-items: center; padding: 12px; border-bottom: 1px solid #262626; }
        .ig-user-avatar { width: 44px; height: 44px; border-radius: 50%; }
        .ig-username { color: #fff; font-weight: 600; text-decoration: none; }
        .ig-badge { background: #0095f6; color: white; padding: 2px 5px; border-radius: 3px; font-size: 10px; }
        .ig-selection-panel { position: fixed; left: 20px; bottom: 20px; width: 220px; background: #121212; padding: 15px; border-radius: 8px; border: 1px solid #ed4956; box-shadow: 0 4px 20px rgba(0,0,0,0.8); display: none; }
        .ig-timer { color: #ed4956; font-weight: bold; font-size: 11px; margin-top: 5px; }
    `;
    document.head.appendChild(style);

    let followers = [], following = [], currentDataInView = [], currentTitleInView = "";

    const fetchAll = async (userId, isFollowers, totalCount) => {
        let items = [], after = null, count = 0;
        while (true) {
            const queryHash = isFollowers ? '37479f2b8209594dde7facb0d904896a' : 'd04b0a864b4b54837c0d870b0e77e076';
            const variables = encodeURIComponent(JSON.stringify({ id: userId, first: 50, after }));
            try {
                const res = await fetch(`https://www.instagram.com/graphql/query/?query_hash=${queryHash}&variables=${variables}`, { headers: { 'X-IG-App-ID': '936619743392459' } });
                const json = await res.json();
                const data = isFollowers ? json.data.user.edge_followed_by : json.data.user.edge_follow;
                items.push(...data.edges.map(e => ({
                    id: e.node.id, username: e.node.username, fullName: e.node.full_name, isVerified: !!e.node.is_verified,
                    isPrivate: e.node.is_private ?? e.node.is_private_account ?? (e.node.user?.is_private || false),
                    profilePic: e.node.profile_pic_url
                })));
                updateUIProgress(isFollowers, items.length, totalCount);
                if (!data.page_info.has_next_page) break;
                after = data.page_info.end_cursor;
                count++;
                if (count % DELAY.fetch_batch_size === 0) await sleep(DELAY.fetch_batch_pause);
                else await sleep();
            } catch (err) { await sleep(5000); }
        }
        return items.sort((a, b) => a.username.localeCompare(b.username));
    };

    const updateUIProgress = (isF, cur, tot) => {
        const id = isF ? 'prog-fol' : 'prog-foll';
        let container = document.querySelector('.ig-progress');
        if (!container) return; // Hata önleyici
        let el = document.getElementById(id);
        if(!el) { el = document.createElement('div'); el.id = id; container.appendChild(el); }
        el.innerHTML = `<strong>${isF ? 'Takipçiler' : 'Takip Edilenler'}:</strong> %${((cur/tot)*100).toFixed(1)} (${cur}/${tot})`;
    };

    // ÖRNEK KOD.JS İÇERİSİNDEKİ KRİTİK İSTEK YAPISI (Onarıldı)
    const unfollowAction = async (id) => {
        const csrfToken = document.cookie.match(/csrftoken=([^;]+)/)?.[1];
        try {
            const res = await fetch(`https://www.instagram.com/api/v1/web/friendships/${id}/unfollow/`, {
                method: 'POST',
                headers: { 
                    'X-IG-App-ID': '936619743392459', 
                    'X-CSRFToken': csrfToken || '',
                    'X-Instagram-AJAX': '1',
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                credentials: 'include' // Oturum bilgilerini taşımak için şart
            });
            const json = await res.json();
            return json.status === 'ok';
        } catch (e) { return false; }
    };

    const showUsers = (users, title) => {
        currentDataInView = users;
        currentTitleInView = title;
        const hFol = document.getElementById('hidePrivateFollowers').checked;
        const hFoll = document.getElementById('hidePrivateFollowing').checked;

        let filtered = users;
        if (title === "Takipçiler" && hFol) filtered = users.filter(u => !u.isPrivate);
        if ((title === "Takip Edilenler" || title.includes("Etmeyenler")) && hFoll) filtered = users.filter(u => !u.isPrivate);

        const mainDiv = document.querySelector('.ig-main');
        mainDiv.innerHTML = `
            <div class="ig-progress" id="log-status">Şu an: ${title}</div>
            <h3>${title} (${filtered.length})</h3>
            <div class="ig-results">
                ${filtered.map(u => `
                    <div class="ig-user-item">
                        <input type="checkbox" class="ig-checkbox" data-userid="${u.id}" data-username="${u.username}">
                        <img class="ig-user-avatar" src="${u.profilePic}" onerror="this.src='https://www.instagram.com/static/images/anonymousUser.jpg/23e7b3b2a737.jpg'">
                        <div>
                            <a class="ig-username" href="https://instagram.com/${u.username}" target="_blank">${u.username} ${u.isVerified ? '<span class="ig-badge">✓</span>' : ''}</a>
                            <div style="font-size:12px; color:#8e8e8e;">${u.fullName || ''} ${u.isPrivate ? '🔒 (Gizli)' : ''}</div>
                        </div>
                        <button class="ig-button unfollow-btn" id="btn-single-${u.id}" data-userid="${u.id}">Takipten Çık</button>
                    </div>
                `).join('')}
            </div>
        `;

        // Eventleri her seferinde yeniden bağlamalıyız (v1.8.0 mantığı)
        document.querySelectorAll('.ig-checkbox').forEach(cb => {
            cb.onclick = () => {
                const selected = document.querySelectorAll('.ig-checkbox:checked').length;
                document.getElementById('selectionPanel').style.display = selected > 0 ? 'block' : 'none';
                document.getElementById('selectedCountText').innerText = `${selected} kullanıcı seçildi`;
            };
        });

        document.querySelectorAll('.unfollow-btn').forEach(btn => {
            btn.onclick = async () => {
                btn.disabled = true; btn.innerText = "...";
                const ok = await unfollowAction(btn.dataset.userid);
                btn.innerText = ok ? "Çıkıldı" : "Hata";
                btn.style.background = ok ? "#4BB543" : "#ed4956";
            };
        });
    };

    const startBulkUnfollow = async () => {
        const selected = Array.from(document.querySelectorAll('.ig-checkbox:checked')).map(cb => ({
            id: cb.dataset.userid, username: cb.dataset.username
        }));

        if (!confirm(`${selected.length} kişiyi takipten çıkmak üzeresiniz?`)) return;

        const infoBox = document.getElementById('log-status');
        const bulkBtn = document.getElementById('runBulkUnfollow');
        bulkBtn.disabled = true;

        for (let i = 0; i < selected.length; i++) {
            const user = selected[i];
            const rowBtn = document.getElementById(`btn-single-${user.id}`);
            
            if (rowBtn) rowBtn.innerText = "Sırada...";
            if (infoBox) infoBox.innerHTML = `<div style="color:#ed4956"><strong>İşlem Yapılıyor:</strong> @${user.username} (${i+1}/${selected.length})</div>`;
            
            const success = await unfollowAction(user.id);
            
            if (rowBtn) {
                rowBtn.innerText = success ? "Çıkıldı" : "Hata";
                rowBtn.style.background = success ? "#4BB543" : "#ed4956";
            }

            if (i < selected.length - 1) {
                let waitTime = Math.floor(Math.random() * (DELAY.unfollow_max - DELAY.unfollow_min) + DELAY.unfollow_min);
                if ((i + 1) % DELAY.unfollow_batch_size === 0) {
                    waitTime = DELAY.unfollow_long_pause;
                    let remaining = waitTime / 1000;
                    const timer = setInterval(() => {
                        remaining--;
                        if (infoBox) infoBox.innerHTML = `<div style="color:#0095f6"><strong>Mola:</strong> ${Math.floor(remaining/60)}dk ${remaining%60}sn kaldı...</div>`;
                        if (remaining <= 0) clearInterval(timer);
                    }, 1000);
                }
                await new Promise(r => setTimeout(r, waitTime));
            }
        }

        if (infoBox) infoBox.innerHTML = `<div style="color:#4BB543"><strong>✅ Tamamlandı!</strong></div>`;
        alert('İşlem bitti.');
        bulkBtn.disabled = false;
        document.getElementById('selectionPanel').style.display = 'none';
    };

    // UI Kurulumu (v1.8.0 Orijinal Yapı)
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
        <div class="ig-selection-panel" id="selectionPanel">
            <div id="selectedCountText" style="margin-bottom:10px; font-weight:bold; font-size:12px;">0 kişi seçildi</div>
            <button class="ig-button" id="runBulkUnfollow" style="background:#ed4956;">Seçilenleri Takipten Çık</button>
            <div class="ig-timer">Güvenli mod: Her 5 kişide bir 5dk mola verir.</div>
        </div>
        <div class="ig-main"><div class="ig-progress">Analiz için kullanıcı adı girin.</div></div>
    `;
    document.body.appendChild(container);

    document.getElementById('start').onclick = async () => {
        const user = prompt("Instagram Kullanıcı Adınız:");
        if(!user) return;
        const res = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${user}`, { headers: { 'X-IG-App-ID': '936619743392459' } });
        const json = await res.json();
        const u = json.data.user;
        document.getElementById('start').innerText = "Çekiliyor...";

        const [fol, foll] = await Promise.all([
            fetchAll(u.id, true, u.edge_followed_by.count),
            fetchAll(u.id, false, u.edge_follow.count)
        ]);

        followers = fol; following = foll;
        ['btnFol', 'btnFoll', 'btnNot'].forEach(id => document.getElementById(id).disabled = false);
        document.getElementById('start').innerText = "Yeniden Analiz";
        showUsers(following, "Takip Edilenler");
    };

    document.getElementById('btnFol').onclick = () => showUsers(followers, "Takipçiler");
    document.getElementById('btnFoll').onclick = () => showUsers(following, "Takip Edilenler");
    document.getElementById('btnNot').onclick = () => {
        const list = following.filter(f => !followers.some(fol => fol.username === f.username));
        showUsers(list, "Sizi Takip Etmeyenler");
    };

    document.getElementById('runBulkUnfollow').onclick = startBulkUnfollow;
    document.getElementById('hidePrivateFollowers').onchange = () => showUsers(currentDataInView, currentTitleInView);
    document.getElementById('hidePrivateFollowing').onchange = () => showUsers(currentDataInView, currentTitleInView);

})();