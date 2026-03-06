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

# Yeni Eklenen Özellikler

## v1.2.0 Güncellemesi

* Analiz başlatma paneli
* Sizi takip etmeyenleri bulma
* Sizi takip eden ama sizin takip etmediklerinizi bulma
* Checkbox ile kullanıcı seçimi
* Seçilen kullanıcıları toplu takipten çıkarma
* Tüm listeyi tek seferde takipten çıkarma
* Tekli unfollow butonu
* Geliştirilmiş kullanıcı arayüzü
* Alfabetik kullanıcı listeleme
* Profil fotoğrafı gösterimi
* Seçim paneli
* Unfollow işlemleri için güvenli gecikme sistemi

---

## v1.3.7 Güncellemesi (Tam Bütünlük & Syntax Fix)

Yeni sürümde performans ve kullanılabilirlik önemli ölçüde geliştirilmiştir.

### Yeni Özellikler

* Gizli hesapları **tek tıkla gizleme filtresi**
* Görünen kullanıcıları **toplu takipten çıkarma**
* **Geri sayımlı mola sistemi**
* Unfollow işlemlerinde **otomatik batch yönetimi**
* İşlem sırasında **canlı durum göstergesi**
* İşlem tamamlandığında **yeşil buton geri bildirimi**
* Geliştirilmiş liste yönetimi
* Syntax ve stabilite iyileştirmeleri

### Filtreleme Özelliği

Yeni eklenen filtre sayesinde:

* Gizli hesaplar listeden **anında gizlenebilir**

Panelde bulunan seçenek:

```
Gizli Hesapları Gizle
```

aktif edildiğinde:

* 🔒 Private hesaplar listede görünmez
* İşlem yalnızca görünen hesaplara uygulanır

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
* Gizli Hesapları Gizle
* Takip Etmeyenler
* Geri Takip Etmediklerim
* Takipçiler (.csv)
* Takip Edilenler (.csv)

---

# Takip Etmeyenleri Bulma

**Takip Etmeyenler** butonuna bastığınızda:

* Sizi takip etmeyen kullanıcılar listelenir.

Her kullanıcı için:

* Profil fotoğrafı
* Kullanıcı adı
* Tam isim
* Verified durumu
* Private hesap göstergesi

gösterilir.

---

# Geri Takip Etmediklerim

Bu özellik:

* Sizi takip eden
* Ama sizin takip etmediğiniz

kullanıcıları listeler.

Bu özellik sayesinde **karşılıklı olmayan takipleri kolayca analiz edebilirsiniz.**

---

# Takipten Çıkma Özelliği

Script üzerinden doğrudan takipten çıkabilirsiniz.

Her kullanıcı için:

```
Takipten Çık
```

butonu bulunur.

İşlem başarılı olursa buton:

* **Yeşil renge döner**
* "Çıkıldı" mesajı gösterir

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

# Görünenleri Toplu Takipten Çık

Liste üzerinde ayrıca şu seçenek bulunur:

```
Görünenleri Takipten Çık
```

Bu seçenek:

* Filtre uygulanmış listeyi dikkate alır
* Sadece ekranda görünen kullanıcıları takipten çıkarır

---

# CSV Export

Aşağıdaki listeleri CSV olarak indirebilirsiniz:

* Takipçiler
* Takip Edilenler

CSV dosyası şu bilgileri içerir:

* Username
* Full Name
* Verified
* Private

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

### Veri Çekme

* İstekler arası bekleme: **2 saniye**
* Batch boyutu: **5 kullanıcı**
* Batch sonrası bekleme: **50 saniye**

### Unfollow İşlemleri

* Unfollow arası bekleme: **9 saniye**
* 5 işlem sonrası mola: **90 saniye**

Bu ayarlar script içinde şu şekilde tanımlıdır:

```
const DELAY = {
    BETWEEN_REQUESTS: 2000,
    AFTER_BATCH: 50000,
    BATCH_SIZE: 5,
    BETWEEN_UNFOLLOWS: 9000,
    AFTER_UNFOLLOW_BATCH: 90000,
    UNFOLLOW_BATCH_SIZE: 5
};
```

Bu molalar sırasında ekranda geri sayım gösterilir.

---

# Performans

| Takipçi Sayısı | Tahmini Süre |
| -------------- | ------------ |
| 500            | ~3 dakika    |
| 1000           | ~5 dakika    |
| 5000           | ~20+ dakika  |

---

# Güvenlik

Script:

* Tarayıcı içinde çalışır
* Harici sunucuya veri göndermez
* Instagram hesabınıza erişim bilgisi kaydetmez

Tüm işlemler **lokal olarak yapılır.**

---

# Geliştirici Notları

* Node.js 16+ önerilir
* Instagram API değişikliklerinde script güncellemesi gerekebilir

Script Versiyonu:

```
1.3.7
```

---

# Yasal Uyarı

Bu araç Instagram ile resmi olarak ilişkili değildir.
Kendi sorumluluğunuzda kullanın.

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

3. Commit

```
git commit -m 'Add some amazing feature'
```

4. Push

```
git push origin feature/amazing-feature
```

5. Pull Request açın
