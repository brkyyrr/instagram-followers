/**
 * Instagram Follower/Following Analyzer - Geliştirilmiş Seçim Modu
 * * @author    Berkay Yurur
 * @version   1.2.0 (Checkbox Entegrasyonu)
 */

(async () => {
    // Süre sabitleri (Senin orijinal ayarların)
    const DELAY = {
        BETWEEN_REQUESTS: 2000,
        AFTER_BATCH: 50000,
        BATCH_SIZE: 5,
        BETWEEN_UNFOLLOWS: 9000,
        AFTER_UNFOLLOW_BATCH: 90000,
        UNFOLLOW_BATCH_SIZE: 5
    };

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const style = document.createElement('style');
    style.textContent = `
        .ig-container { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: #000; color: #fff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; z-index: 99999; padding: 20px; overflow: auto; }
        .ig-sidebar { position: fixed; left: 20px; top: 80px; width: 200px; background: #121212; padding: 15px; border-radius: 8px; }
        .ig-main { margin-left: 240px; }
        .ig-button { display: block; width: 100%; padding: 10px; margin: 5px 0; background: #0095f6; border: none; border-radius: 4px; color: white; cursor: pointer; font-weight: 600; }
        .ig-button:disabled { background: #004c8c; cursor: not-allowed; }
        .ig-progress { background: #121212; padding: 15px; margin-bottom: 20px; border-radius: 8px; }
        .ig-progress-bar { width: 100%; height: 4px; background: #262626; border-radius: 2px; margin-top: 10px; }
        .ig-progress-bar-fill { height: 100%; background: #0095f6; border-radius: 2px; transition: width 0.3s; }
        .ig-user-item { display: grid; grid-template-columns: 30px 44px 1fr 120px; gap: 12px; align-items: center; padding: 12px; border-bottom: 1px solid #262626; }
        .ig-user-avatar { width: 44px; height: 44px; border-radius: 50%; }
        .ig-username { color: #fff; font-weight: 600; text-decoration: none; }
        .ig-fullname { color: #8e8e8e; font-size: 14px; }
        .ig-checkbox { width: 18px; height: 18px; cursor: pointer; }
        .ig-badge { background: #0095f6; color: white; padding: 2px 6px; border-radius: 3px; font-size: 12px; margin-left: 6px; }
        .selection-panel { position: fixed; bottom: 20px; right: 20px; background: #121212; padding: 15px; border-radius: 8px; border: 1px solid #0095f6; box-shadow: 0 4px 20px rgba(0,0,0,0.8); z-index: 100000; }
        .ig-initial-header { background: #1a1a1a; color: #fff; padding: 10px 15px; font-size: 18px; font-weight: bold; margin-top: 10px; border-radius: 4px; position: sticky; top: 0; z-index: 1; }
    `;
    document.head.appendChild(style);

    let followers = [];
    let following = [];
    let userData = null;

    // --- MEVCUT YARDIMCI FONKSİYONLAR (DOKUNULMADI) ---
    const getUserData = async (username) => {
        try {
            const response = await fetch(`https://www.instagram.com/api/v1/users/web_profile_info/?username=${username}`, {
                headers: { 'Accept': '*/*', 'X-IG-App-ID': '936619743392459' },
                credentials: 'include'
            });
            const data = await response.json();
            return data.data.user;
        } catch (error) { return null; }
    };

    const getUsers = async (userId, isFollowers = true, after = null, users = [], totalUsers = 0, requestCount = 0) => {
        if (requestCount > 0 && requestCount % DELAY.BATCH_SIZE === 0) {
            await delay(DELAY.AFTER_BATCH);
        } else if (requestCount > 0) {
            await delay(DELAY.BETWEEN_REQUESTS);
        }
        const variables = { id: userId, first: 50, after: after };
        const queryHash = isFollowers ? '37479f2b8209594dde7facb0d904896a' : 'd04b0a864b4b54837c0d870b0e77e076';
        const response = await fetch(`https://www.instagram.com/graphql/query/?query_hash=${queryHash}&variables=${encodeURIComponent(JSON.stringify(variables))}`, {
            headers: { 'X-IG-App-ID': '936619743392459' },
            credentials: 'include'
        });
        const data = await response.json();
        const edges = isFollowers ? data.data.user.edge_followed_by.edges : data.data.user.edge_follow.edges;
        const pageInfo = isFollowers ? data.data.user.edge_followed_by.page_info : data.data.user.edge_follow.page_info;
        const newUsers = edges.map(edge => ({
            id: edge.node.id,
            username: edge.node.username,
            fullName: edge.node.full_name,
            isVerified: edge.node.is_verified,
            isPrivate: edge.node.is_private,
            profilePic: edge.node.profile_pic_url
        }));
        users.push(...newUsers);
        updateProgress(users.length, totalUsers, isFollowers);
        if (pageInfo.has_next_page) {
            return getUsers(userId, isFollowers, pageInfo.end_cursor, users, totalUsers, requestCount + 1);
        }
        return sortUsersByUsername(users);
    };

    const turkishToEnglish = (text) => {
        if (!text) return '';
        const charMap = { 'ı': 'i', 'İ': 'I', 'ğ': 'g', 'Ğ': 'G', 'ü': 'u', 'Ü': 'U', 'ş': 's', 'Ş': 'S', 'ö': 'o', 'Ö': 'O', 'ç': 'c', 'Ç': 'C' };
        return text.replace(/[ıİğĞüÜşŞöÖçÇ]/g, letter => charMap[letter] || letter);
    };

    const sortUsersByUsername = (users) => {
        return users.sort((a, b) => a.username.toLowerCase().localeCompare(b.username.toLowerCase()));
    };

    const exportToCSV = (data, filename) => {
        const csv = [['Username', 'Full Name', 'Verified', 'Private'], ...data.map(user => [turkishToEnglish(user.username), turkishToEnglish(user.fullName), user.isVerified ? 'Yes' : 'No', user.isPrivate ? 'Yes' : 'No'])].map(row => row.join(',')).join('\n');
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    };

    const updateProgress = (current, total, isFollowers) => {
        const progressDiv = document.querySelector('.ig-progress');
        if (progressDiv) {
            const percentage = Math.min((current / total) * 100, 100);
            progressDiv.innerHTML = `<div>${isFollowers ? 'Takipçi' : 'Takip edilen'} yükleniyor... (${current}/${total})</div><div class="ig-progress-bar"><div class="ig-progress-bar-fill" style="width: ${percentage}%"></div></div>`;
        }
    };

    // --- YENİ SEÇİMLİ UI VE TAKİPTEN ÇIKARMA MANTIĞI ---
    const showUsers = (users, title) => {
        const sortedUsers = sortUsersByUsername(users);
        const mainDiv = document.querySelector('.ig-main');
        
        mainDiv.innerHTML = `
            <h2>${title} (${sortedUsers.length})</h2>
            ${(title.includes('Takip Etmeyenler')) ? `
                <div style="text-align: center;">
                    <button class="ig-button" id="unfollowAll" style="max-width:300px; display:inline-block;">Tümünü Takipten Çık</button>
                    <div class="ig-warning">⚠️ Kutucukları kullanarak seçim yapabilir veya tümünü çıkarabilirsiniz.</div>
                </div>
            ` : ''}
            <div class="ig-results">
                ${sortedUsers.map((user, index, array) => {
                    const prevInitial = index > 0 ? array[index - 1].username[0].toUpperCase() : '';
                    const currentInitial = user.username[0].toUpperCase();
                    const initialHeader = (index === 0 || prevInitial !== currentInitial) ? `<div class="ig-initial-header">${currentInitial}</div>` : '';
                    
                    return `
                        ${initialHeader}
                        <div class="ig-user-item" id="user-row-${user.id}">
                            <input type="checkbox" class="ig-checkbox" data-userid="${user.id}" data-username="${user.username}">
                            <img class="ig-user-avatar" src="${user.profilePic || ''}" onerror="this.src='https://www.instagram.com/static/images/anonymousUser.jpg/23e7b3b2a737.jpg'">
                            <div class="ig-user-info">
                                <a href="https://instagram.com/${user.username}" class="ig-username" target="_blank">
                                    ${user.username} ${user.isVerified ? '<span class="ig-badge">✓</span>' : ''}
                                </a>
                                <div class="ig-fullname">${user.fullName}${user.isPrivate ? ' 🔒' : ''}</div>
                            </div>
                            <button class="ig-button unfollow-single" data-userid="${user.id}">Takipten Çık</button>
                        </div>
                    `;
                }).join('')}
            </div>
            <div class="selection-panel" id="selectionPanel" style="display: none;">
                <div id="selectedInfo" style="margin-bottom:10px; font-weight:bold;">0 kişi seçildi</div>
                <button class="ig-button" id="unfollowSelectedBtn" style="background: #ed4956;">Seçilenleri Takipten Çık</button>
            </div>
        `;

        // Checkbox Takibi
        const checkboxes = document.querySelectorAll('.ig-checkbox');
        const panel = document.getElementById('selectionPanel');
        const info = document.getElementById('selectedInfo');

        checkboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                const checkedCount = document.querySelectorAll('.ig-checkbox:checked').length;
                panel.style.display = checkedCount > 0 ? 'block' : 'none';
                info.innerText = `${checkedCount} kişi seçildi`;
            });
        });

        // Orijinal Tekli Takipten Çıkma Butonları
        document.querySelectorAll('.unfollow-single').forEach(button => {
            button.addEventListener('click', async () => {
                button.disabled = true;
                const success = await unfollowUser(button.dataset.userid);
                button.textContent = success ? 'Takipten Çıkıldı' : 'Hata!';
                button.style.backgroundColor = success ? '#4BB543' : '#ff0000';
            });
        });

        // Toplu Takipten Çıkma (Checkbox ile seçilenler)
        document.getElementById('unfollowSelectedBtn')?.addEventListener('click', async () => {
            const selectedBoxes = Array.from(document.querySelectorAll('.ig-checkbox:checked'));
            const usersToUnfollow = selectedBoxes.map(cb => ({
                id: cb.dataset.userid,
                username: cb.dataset.username
            }));

            if(confirm(`${usersToUnfollow.length} kişiyi takipten çıkarmak istediğinize emin misiniz?`)) {
                await processUnfollowList(usersToUnfollow);
            }
        });

        // Orijinal Tümünü Çıkma Butonu
        document.getElementById('unfollowAll')?.addEventListener('click', async () => {
            if (confirm('TÜM listeyi takipten çıkarmak istediğinize emin misiniz?')) {
                await processUnfollowList(users);
            }
        });
    };

    // Takipten Çıkma İşlemi (Gecikmeli Döngü)
    const processUnfollowList = async (list) => {
        let count = 0;
        let successCount = 0;
        const btn = document.getElementById('unfollowSelectedBtn') || document.getElementById('unfollowAll');
        const progressDiv = document.querySelector('.ig-progress');

        for (const user of list) {
            count++;
            if (btn) btn.innerText = `İşleniyor: ${count}/${list.length}`;
            
            const row = document.getElementById(`user-row-${user.id}`);
            if(row) row.style.opacity = "0.4";

            const success = await unfollowUser(user.id);
            if (success) successCount++;

            progressDiv.innerHTML = `<div>Takipten çıkılıyor: ${count}/${list.length} (Başarılı: ${successCount})</div>`;

            if (count < list.length) {
                if (count % DELAY.UNFOLLOW_BATCH_SIZE === 0) {
                    console.log("Batch mola veriliyor...");
                    await delay(DELAY.AFTER_UNFOLLOW_BATCH);
                } else {
                    await delay(DELAY.BETWEEN_UNFOLLOWS);
                }
            }
        }
        alert(`İşlem bitti! Toplam ${successCount} kişi takipten çıkarıldı.`);
    };

    const unfollowUser = async (userId) => {
        try {
            const response = await fetch(`https://www.instagram.com/api/v1/web/friendships/${userId}/unfollow/`, {
                method: 'POST',
                headers: {
                    'X-IG-App-ID': '936619743392459',
                    'X-CSRFToken': document.cookie.match(/csrftoken=([^;]+)/)?.[1] || '',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                credentials: 'include'
            });
            const data = await response.json();
            return data.status === 'ok';
        } catch (error) { return false; }
    };

    // --- ANA DÖNGÜ VE EVENTLER (DOKUNULMADI) ---
    const container = document.createElement('div');
    container.className = 'ig-container';
    container.innerHTML = `
        <div class="ig-sidebar">
            <button class="ig-button" id="startAnalysis">Analizi Başlat</button>
            <button class="ig-button" id="compareUsers" disabled>Takip Etmeyenleri Bul</button>
            <button class="ig-button" id="findNonFollowing" disabled>Beni Takip Eden Ama Ben Takip Etmeyenler</button>
            <button class="ig-button" id="exportFollowers" disabled>Takipçiler (.csv)</button>
            <button class="ig-button" id="exportFollowing" disabled>Takip Edilenler (.csv)</button>
            <button class="ig-button" id="exportNonFollowers" disabled>Takip Etmeyenler (.csv)</button>
        </div>
        <div class="ig-main">
            <div class="ig-progress">Analizi başlatmak için butona tıklayın...</div>
        </div>
    `;
    document.body.appendChild(container);

    document.getElementById('startAnalysis').addEventListener('click', async () => {
        const btn = document.getElementById('startAnalysis');
        const username = prompt('Instagram kullanıcı adını girin:');
        if (!username) return;
        btn.disabled = true; btn.textContent = 'Analiz Yapılıyor...';
        
        userData = await getUserData(username);
        if (userData) {
            followers = await getUsers(userData.id, true, null, [], userData.edge_followed_by.count);
            following = await getUsers(userData.id, false, null, [], userData.edge_follow.count);
            btn.textContent = 'Analiz Tamamlandı';
            btn.disabled = false;
            document.getElementById('compareUsers').disabled = false;
            document.getElementById('findNonFollowing').disabled = false;
            document.getElementById('exportFollowers').disabled = false;
            document.getElementById('exportFollowing').disabled = false;
            showUsers(following, 'Takip Edilenler');
        }
    });

    document.getElementById('compareUsers').addEventListener('click', () => {
        const nonFollowers = following.filter(f => !followers.some(fol => fol.username === f.username));
        showUsers(nonFollowers, 'Sizi Takip Etmeyenler');
        document.getElementById('exportNonFollowers').disabled = false;
    });

    document.getElementById('findNonFollowing').addEventListener('click', () => {
        const nonFollowing = followers.filter(fol => !following.some(f => f.username === fol.username));
        showUsers(nonFollowing, 'Beni Takip Eden Ama Ben Takip Etmeyenler');
    });

    document.getElementById('exportFollowers').addEventListener('click', () => exportToCSV(followers, 'takipciler.csv'));
    document.getElementById('exportFollowing').addEventListener('click', () => exportToCSV(following, 'takip_edilenler.csv'));
    document.getElementById('exportNonFollowers').addEventListener('click', () => {
        const nonFollowers = following.filter(f => !followers.some(fol => fol.username === f.username));
        exportToCSV(nonFollowers, 'takip_etmeyenler.csv');
    });

})();