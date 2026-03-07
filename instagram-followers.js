/**
 * Instagram Follower/Following Analyzer
 * @author    Berkay Yurur
 * @version   1.4.0 (Takipçi Görüntüleme Desteği)
 * * Özellikler:
 * - Takip Etmeyenler & Geri Takip Etmediklerim Analizi
 * - Takipçi Listesini Görüntüleme (Yeni!)
 * - CSV Olarak Dışa Aktarma (Takipçi ve Takip Edilenler)
 * - Gizli Hesap Filtresi (🔒 İkonu Dahil)
 * - Doğrulanmış Hesap Rozeti (✓)
 * - Hızlı Takipten Çıkma (2s Ara ile)
 * - 5 Kişide Bir 30s Mola & Geri Sayım Sayacı
 * - İşlem Sonrası Yeşil Buton Geri Bildirimi
 */

(async () => {
    // Süre sabitleri
    const DELAY = {
        BETWEEN_REQUESTS: 800,
        AFTER_BATCH: 8000,
        BATCH_SIZE: 10,
        BETWEEN_UNFOLLOWS: 2000,      
        AFTER_UNFOLLOW_BATCH: 30000,  
        UNFOLLOW_BATCH_SIZE: 5       
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const style = document.createElement('style');
    style.textContent = `
        .ig-container { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; z-index: 99999; padding: 20px; overflow: auto; }
        .ig-sidebar { position: fixed; left: 20px; top: 80px; width: 220px; background: #121212; padding: 15px; border-radius: 8px; border: 1px solid #262626; }
        .ig-main { margin-left: 260px; }
        .ig-button { display: block; width: 100%; padding: 10px; margin: 5px 0; background: #0095f6; border: none; border-radius: 4px; color: white; cursor: pointer; font-weight: 600; text-align: center; transition: all 0.2s ease; }
        .ig-button:disabled { background: #004c8c; cursor: not-allowed; opacity: 0.7; }
        .ig-progress { background: #121212; padding: 15px; margin-bottom: 20px; border-radius: 8px; border: 1px solid #262626; line-height: 1.6; }
        .ig-progress-bar { width: 100%; height: 4px; background: #262626; border-radius: 2px; margin-top: 10px; }
        .ig-progress-bar-fill { height: 100%; background: #0095f6; border-radius: 2px; transition: width 0.3s; }
        .ig-user-item { display: grid; grid-template-columns: 30px 44px 1fr 140px; gap: 12px; align-items: center; padding: 12px; border-bottom: 1px solid #262626; }
        .ig-user-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
        .ig-username { color: #fff; font-weight: 600; text-decoration: none; }
        .ig-fullname { color: #8e8e8e; font-size: 14px; }
        .ig-checkbox { width: 18px; height: 18px; cursor: pointer; }
        .ig-badge { background: #0095f6; color: white; padding: 2px 6px; border-radius: 3px; font-size: 11px; margin-left: 6px; }
        .ig-filter-box { background: #1a1a1a; padding: 12px; margin: 10px 0; border-radius: 6px; border: 1px solid #333; font-size: 13px; }
        .ig-filter-box label { display: flex; align-items: center; gap: 8px; cursor: pointer; color: #efefef; }
        .selection-panel { position: fixed; bottom: 20px; right: 20px; background: #121212; padding: 15px; border-radius: 8px; border: 1px solid #0095f6; box-shadow: 0 4px 25px rgba(0,0,0,0.9); z-index: 100001; min-width: 200px; }
        .ig-initial-header { background: #1a1a1a; color: #fff; padding: 10px 15px; font-size: 18px; font-weight: bold; margin-top: 10px; border-radius: 4px; position: sticky; top: 0; z-index: 2; }
    `;
    document.head.appendChild(style);

    let followers = [];
    let following = [];
    let userData = null;
    let currentDataInView = [];

    // --- API VE VERİ İŞLEME ---
    const getUserData = async (username) => {
        try {
            const response = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
                headers: { 'Accept': '*/*', 'X-IG-App-ID': '936619743392459' },
                credentials: 'include'
            });
            const data = await response.json();
            return data.data.user;
        } catch (e) { return null; }
    };

    const getUsers = async (userId, isFollowers = true, after = null, users = [], totalUsers = 0, requestCount = 0) => {
        if (requestCount > 0 && requestCount % DELAY.BATCH_SIZE === 0) await delay(DELAY.AFTER_BATCH);
        else if (requestCount > 0) await delay(DELAY.BETWEEN_REQUESTS);

        const variables = { id: userId, first: 50, after: after };
        const queryHash = isFollowers ? '37479f2b8209594dde7facb0d904896a' : 'd04b0a864b4b54837c0d870b0e77e076';
        const response = await fetch(`https://www.instagram.com/graphql/query/?query_hash=${queryHash}&variables=${encodeURIComponent(JSON.stringify(variables))}`, {
            headers: { 'X-IG-App-ID': '936619743392459' },
            credentials: 'include'
        });
        const data = await response.json();
        const edges = isFollowers ? data.data.user.edge_followed_by.edges : data.data.user.edge_follow.edges;
        const pageInfo = isFollowers ? data.data.user.edge_followed_by.page_info : data.data.user.edge_follow.page_info;

        users.push(...edges.map(e => ({
            id: e.node.id, username: e.node.username, fullName: e.node.full_name,
            isVerified: e.node.is_verified, isPrivate: e.node.is_private, profilePic: e.node.profile_pic_url
        })));

        updateProgressBar(users.length, totalUsers, isFollowers);
        if (pageInfo.has_next_page) return getUsers(userId, isFollowers, pageInfo.end_cursor, users, totalUsers, requestCount + 1);
        return users.sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));
    };

    const exportToCSV = (data, filename) => {
        const trToEn = (t) => {
            if (!t) return '';
            const m = { 'ı': 'i', 'İ': 'I', 'ğ': 'g', 'Ğ': 'G', 'ü': 'u', 'Ü': 'U', 'ş': 's', 'Ş': 'S', 'ö': 'o', 'Ö': 'O', 'ç': 'c', 'Ç': 'C' };
            return t.replace(/[ıİğĞüÜşŞöÖçÇ]/g, l => m[l] || l);
        };
        const csv = [['Username', 'Full Name', 'Verified', 'Private'], ...data.map(u => [trToEn(u.username), trToEn(u.fullName), u.isVerified ? 'Yes' : 'No', u.isPrivate ? 'Yes' : 'No'])].map(r => r.join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    const updateProgressBar = (cur, tot, isF) => {
        const perc = Math.min((cur / tot) * 100, 100);
        const progDiv = document.querySelector('.ig-progress');
        if(progDiv) {
            progDiv.innerHTML = `<div>${isF ? 'Takipçiler' : 'Takip Edilenler'} Çekiliyor: ${cur}/${tot}</div><div class="ig-progress-bar"><div class="ig-progress-bar-fill" style="width: ${perc}%"></div></div>`;
        }
    };

    // --- ARAYÜZ OLUŞTURMA ---
    const showUsers = (users, title) => {
        currentDataInView = users;
        const hidePriv = document.getElementById('hidePrivateFilter').checked;
        const filtered = hidePriv ? users.filter(u => !u.isPrivate) : users;

        const mainDiv = document.querySelector('.ig-main');
        mainDiv.innerHTML = `
            <h2>${title} (${filtered.length})</h2>
            ${(title.includes('Takip Etmeyenler') || title.includes('Takip Edilenler')) ? `
                <div style="text-align: center; margin-bottom: 20px;">
                    <button class="ig-button" id="unfollowAllVisible" style="max-width:300px; display:inline-block;">Görünenleri Takipten Çık</button>
                </div>
            ` : ''}
            <div class="ig-results">
                ${filtered.map((user, index, array) => {
                    const initialHeader = (index === 0 || array[index-1].username[0].toUpperCase() !== user.username[0].toUpperCase()) 
                        ? `<div class="ig-initial-header">${user.username[0].toUpperCase()}</div>` : '';
                    return `
                        ${initialHeader}
                        <div class="ig-user-item" id="user-row-${user.id}">
                            <input type="checkbox" class="ig-checkbox" data-userid="${user.id}">
                            <img class="ig-user-avatar" src="${user.profilePic || ''}" onerror="this.src='https://www.instagram.com/static/images/anonymousUser.jpg/23e7b3b2a737.jpg'">
                            <div class="ig-user-info">
                                <a href="https://instagram.com/${user.username}" class="ig-username" target="_blank">${user.username} ${user.isVerified ? '<span class="ig-badge">✓</span>' : ''}</a>
                                <div class="ig-fullname">${user.fullName} ${user.isPrivate ? '🔒 (Gizli)' : ''}</div>
                            </div>
                            <button class="ig-button unfollow-single" id="btn-unfollow-${user.id}" data-userid="${user.id}" style="width:120px; height:32px; padding:0; font-size:12px;">Takipten Çık</button>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="selection-panel" id="selectionPanel" style="display: none;">
                <div id="selectedCountInfo" style="margin-bottom:10px; font-weight:bold;">0 kişi seçildi</div>
                <button class="ig-button" id="unfollowSelectedBtn" style="background: #ed4956;">Seçilenleri Takipten Çık</button>
            </div>
        `;
        rebindEvents(filtered);
    };

    const rebindEvents = (visibleList) => {
        const panel = document.getElementById('selectionPanel');
        if(panel) panel.style.display = 'none';

        document.querySelectorAll('.ig-checkbox').forEach(cb => {
            cb.addEventListener('change', () => {
                const checked = document.querySelectorAll('.ig-checkbox:checked').length;
                if(panel) panel.style.display = checked > 0 ? 'block' : 'none';
                const info = document.getElementById('selectedCountInfo');
                if(info) info.innerText = `${checked} kişi seçildi`;
            });
        });

        document.querySelectorAll('.unfollow-single').forEach(btn => {
            btn.addEventListener('click', async () => {
                btn.disabled = true;
                const ok = await unfollowUser(btn.dataset.userid);
                if (ok) { btn.textContent = 'Çıkıldı'; btn.style.backgroundColor = '#4BB543'; }
                else { btn.textContent = 'Hata!'; btn.disabled = false; }
            });
        });

        const unfollowSelectedBtn = document.getElementById('unfollowSelectedBtn');
        if(unfollowSelectedBtn) {
            unfollowSelectedBtn.addEventListener('click', () => {
                const sel = Array.from(document.querySelectorAll('.ig-checkbox:checked')).map(cb => ({ id: cb.dataset.userid }));
                if(confirm('Seçilenler çıkarılsın mı?')) processBulk(sel);
            });
        }

        const unfollowAllBtn = document.getElementById('unfollowAllVisible');
        if(unfollowAllBtn) {
            unfollowAllBtn.addEventListener('click', () => {
                if(confirm('Listedeki HERKES çıkarılsın mı?')) processBulk(visibleList);
            });
        }
    };

    const unfollowUser = async (id) => {
        try {
            const res = await fetch(`https://www.instagram.com/api/v1/web/friendships/${id}/unfollow/`, {
                method: 'POST',
                headers: { 'X-IG-App-ID': '936619743392459', 'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '', 'Content-Type': 'application/x-www-form-urlencoded' },
                credentials: 'include'
            });
            const json = await res.json();
            return json.status === 'ok';
        } catch (e) { return false; }
    };

    const processBulk = async (list) => {
        const infoBar = document.querySelector('.ig-progress');
        for (let i = 0; i < list.length; i++) {
            const uId = list[i].id;
            const btn = document.getElementById(`btn-unfollow-${uId}`);
            if (btn) { btn.disabled = true; btn.textContent = '...'; }

            const ok = await unfollowUser(uId);
            if (btn) {
                btn.textContent = ok ? 'Çıkıldı' : 'Hata!';
                btn.style.backgroundColor = ok ? '#4BB543' : '#ff0000';
            }

            if(infoBar) infoBar.innerHTML = `<div>İşlem: ${i+1}/${list.length} tamamlandı.</div>`;

            if (i < list.length - 1) {
                const isMola = (i + 1) % DELAY.UNFOLLOW_BATCH_SIZE === 0;
                const wait = isMola ? DELAY.AFTER_UNFOLLOW_BATCH : DELAY.BETWEEN_UNFOLLOWS;
                
                if (isMola) {
                    let s = wait / 1000;
                    const timer = setInterval(() => {
                        s--;
                        if(infoBar) infoBar.innerHTML = `<div style="color:#0095f6">⏱ Mola veriliyor: ${s}s kaldı (İşlem: ${i+1}/${list.length})</div>`;
                        if (s <= 0) clearInterval(timer);
                    }, 1000);
                }
                await delay(wait);
            }
        }
        if(infoBar) infoBar.innerHTML = `<div>✅ İşlem Tamamlandı.</div>`;
        alert('Toplu işlem bitti.');
    };

    // --- ANA KONTROLLER ---
    const container = document.createElement('div');
    container.className = 'ig-container';
    container.innerHTML = `
        <div class="ig-sidebar">
            <button class="ig-button" id="startAnalysis">Analizi Başlat</button>
            <div class="ig-filter-box">
                <label><input type="checkbox" id="hidePrivateFilter"> Gizli Hesapları Gizle</label>
            </div>
            <button class="ig-button" id="showFollowers" disabled>Takipçiler</button>
            <button class="ig-button" id="compareUsers" disabled>Takip Etmeyenler</button>
            <button class="ig-button" id="findNonFollowing" disabled>Geri Takip Etmediklerim</button>
            <hr style="border:0; border-top:1px solid #262626; margin:10px 0;">
            <button class="ig-button" id="expFol" disabled style="background:#333; font-size:11px;">Takipçiler (.csv)</button>
            <button class="ig-button" id="expFoll" disabled style="background:#333; font-size:11px;">Takip Edilenler (.csv)</button>
        </div>
        <div class="ig-main"><div class="ig-progress">Analizi başlatmak için kullanıcı adınızı girin...</div></div>
    `;
    document.body.appendChild(container);

    const filterCheck = document.getElementById('hidePrivateFilter');
    if(filterCheck) {
        filterCheck.addEventListener('change', () => {
            if(currentDataInView.length) showUsers(currentDataInView, "Liste");
        });
    }

    const startBtn = document.getElementById('startAnalysis');
    if(startBtn) {
        startBtn.addEventListener('click', async () => {
            const u = prompt('Instagram Kullanıcı Adı:');
            if(!u) return;
            startBtn.disabled = true; startBtn.textContent = 'Yükleniyor...';
            userData = await getUserData(u);
            if(userData) {
                followers = await getUsers(userData.id, true, null, [], userData.edge_followed_by.count);
                following = await getUsers(userData.id, false, null, [], userData.edge_follow.count);
                
                // Butonları Aktif Et
                document.getElementById('showFollowers').disabled = false;
                document.getElementById('compareUsers').disabled = false;
                document.getElementById('findNonFollowing').disabled = false;
                document.getElementById('expFol').disabled = false;
                document.getElementById('expFoll').disabled = false;
                
                showUsers(following, "Takip Edilenler");
            }
            startBtn.disabled = false; startBtn.textContent = 'Analiz Bitti';
        });
    }

    // --- BUTON OLAYLARI ---
    document.getElementById('showFollowers').addEventListener('click', () => {
        showUsers(followers, "Takipçiler");
    });

    document.getElementById('compareUsers').addEventListener('click', () => {
        const l = following.filter(f => !followers.some(fol => fol.username === f.username));
        showUsers(l, "Sizi Takip Etmeyenler");
    });

    document.getElementById('findNonFollowing').addEventListener('click', () => {
        const l = followers.filter(fol => !following.some(f => f.username === fol.username));
        showUsers(l, "Geri Takip Etmediklerim");
    });

    document.getElementById('expFol').addEventListener('click', () => exportToCSV(followers, 'takipciler.csv'));
    document.getElementById('expFoll').addEventListener('click', () => exportToCSV(following, 'takip_edilenler.csv'));

})();