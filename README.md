# Instagram Follower/Following Analyzer

[![Maintenance](https://img.shields.io/maintenance/yes/2024)](https://github.com/yourusername/instagram-follower-analyzer)

Tarayıcı üzerinden Instagram takipçilerinizi ve takip ettiklerinizi analiz etmenizi sağlayan bir araç. <u>Kurulum gerektirmez, doğrudan tarayıcı üzerinden çalışır!</u>

---

# Özellikler

## Temel Özellikler

* Takipçileri ve takip edilenleri ayrı ayrı görüntüleme
* Onaylı (verified) hesapları gösterme
* Gizli hesapları gösterme
* CSV olarak dışa aktarma
* Batch işleme (istekleri gruplar halinde yapar)
* İlerleme çubuğu
* Instagram rate limiting koruması
* Türkçe karakter desteği

---

## Yeni Eklenen Özellikler (v1.2.0)

* **Analiz başlatma paneli**
* **Sizi takip etmeyenleri bulma**
* **Sizi takip eden ama sizin takip etmediklerinizi bulma**
* **Checkbox ile kullanıcı seçimi**
* **Seçilen kullanıcıları toplu takipten çıkarma**
* **Tüm listeyi tek seferde takipten çıkarma**
* **Tekli unfollow butonu**
* **Geliştirilmiş kullanıcı arayüzü**
* **Alfabetik kullanıcı listeleme**
* **Profil fotoğrafı gösterimi**
* **Seçim paneli**
* **Unfollow işlemleri için güvenli gecikme sistemi**

---

# Kullanım

### Adımlar

1. Instagram.com'a giriş yapın

2. Tarayıcınızda geliştirici konsolunu açın

Windows:

```
Ctrl + Shift + J
```

Mac OS:

```
⌘ + ⌥ + I
```

3. Script kodunu konsola yapıştırın ve **Enter** tuşuna basın

4. Sayfada bir kontrol paneli açılacaktır

5. Panelden:

* **Analizi Başlat** butonuna basın
* Instagram kullanıcı adınızı girin
* Script takipçi ve takip edilen listesini çekecektir

---

# Arayüz

Script çalıştırıldığında sayfanın üstüne bir analiz paneli eklenir.

### Sol Menü

Panelde şu seçenekler bulunur:

* Analizi Başlat
* Takip Etmeyenleri Bul
* Beni Takip Eden Ama Ben Takip Etmeyenler
* Takipçiler (.csv)
* Takip Edilenler (.csv)
* Takip Etmeyenler (.csv)

---

# Takip Etmeyenleri Bulma

**Takip Etmeyenleri Bul** butonuna bastığınızda:

* Sizi takip etmeyen kullanıcılar listelenir.

Her kullanıcı için:

* Profil fotoğrafı
* Kullanıcı adı
* Tam isim
* Verified durumu
* Private hesap göstergesi

gösterilir.

---

# Takipten Çıkma Özelliği

Script üzerinden doğrudan takipten çıkabilirsiniz.

Her kullanıcı için:

```
Takipten Çık
```

butonu bulunur.

Bu buton ile **tekli unfollow** yapılabilir.

---

# Çoklu Seçim (Checkbox)

Listede her kullanıcının yanında bir checkbox bulunur.

İstediğiniz kullanıcıları seçebilirsiniz.

Seçim yaptığınızda ekranda bir panel görünür.

Panelde:

```
X kişi seçildi
Seçilenleri Takipten Çık
```

butonu bulunur.

Bu buton ile **seçilen kullanıcılar toplu olarak takipten çıkarılır.**

---

# Tümünü Takipten Çık

Takip etmeyenler listesinde ayrıca:

```
Tümünü Takipten Çık
```

butonu bulunur.

Bu seçenek listedeki tüm hesapları takipten çıkarır.

⚠️ Bu işlem geri alınamaz.

---

# CSV Export

Aşağıdaki listeleri CSV olarak indirebilirsiniz:

* Takipçiler
* Takip Edilenler
* Takip Etmeyenler

CSV dosyası şu bilgileri içerir:

* Username
* Full Name
* Verified
* Private

Dosyalar Excel veya Google Sheets ile açılabilir.

---

# Teknik Detaylar

Script aşağıdaki sistemleri kullanır:

* Instagram GraphQL API
* Instagram Web API
* Async Fetch
* Batch Request sistemi
* Rate limit koruması

Kullanılan endpointler:

```
/graphql/query/
/api/v1/users/web_profile_info/
/api/v1/web/friendships/{userId}/unfollow/
```

---

# Rate Limiting Koruması

Instagram tarafından engellenmemek için script gecikmeler kullanır.

Varsayılan değerler:

* İstekler arası bekleme: **2 saniye**
* Batch veri çekme: **5 istek**
* Batch sonrası bekleme: **50 saniye**
* Unfollow arası bekleme: **9 saniye**
* Unfollow batch: **5 işlem**
* Unfollow batch sonrası bekleme: **90 saniye**

Bu değerler script içinde değiştirilebilir.

---

# Performans

Takipçi sayısına bağlı olarak analiz süresi değişebilir.

Örnek süreler:

| Takipçi Sayısı | Tahmini Süre |
| -------------- | ------------ |
| 500            | ~1 dakika    |
| 1000           | ~2 dakika    |
| 5000           | ~8-10 dakika |

---

# Notlar

* **Çok sayıda takipçisi olan hesaplar için işlem uzun sürebilir**
* **Instagram'ın rate limiting politikaları nedeniyle beklemeler olabilir**
* **Sadece erişilebilir hesapların takipçi listesi çekilebilir**

---

# Güvenlik

Script:

* Tarayıcı içinde çalışır
* Harici sunucuya veri göndermez
* Instagram hesabınıza erişim bilgisi kaydetmez

Tüm işlemler **lokal olarak yapılır.**

---

# Geliştirici Notları

* Node.js sürümü: 16.14.0 ve üzeri önerilir
* Kod güncellemeleri için rate limiting değerlerini ayarlayabilirsiniz
* Instagram API değişikliklerinde güncelleme gerekebilir

Script Versiyonu:

```
1.2.0
```

---

# Yasal Uyarı

**Bu araç Instagram ile resmi olarak ilişkili değildir. Instagram'ın API politikalarına uygun olarak geliştirilmiştir.**

Kendi sorumluluğunuzda kullanın!

---

# Lisans

MIT License

---

# Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun

```
git checkout -b feature/amazing-feature
```

3. Değişikliklerinizi commit edin

```
git commit -m 'Add some amazing feature'
```

4. Branch'inizi push edin

```
git push origin feature/amazing-feature
```

5. Pull Request açın
