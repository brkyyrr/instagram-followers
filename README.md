# Instagram Follower / Following Analyzer

[![Maintenance](https://img.shields.io/badge/maintained-yes-green)]()

Instagram takipçi ve takip edilen analizini **tarayıcı üzerinden doğrudan yapmanızı sağlayan bir JavaScript aracıdır.**

Kurulum gerektirmez.
Scripti **tarayıcı konsoluna yapıştırarak çalıştırabilirsiniz.**

---

# Özellikler

## Temel Özellikler

* Takipçileri görüntüleme
* Takip edilenleri görüntüleme
* Sizi takip etmeyenleri bulma
* Geri takip etmediğiniz kullanıcıları bulma
* CSV olarak dışa aktarma
* Instagram rate limit koruması
* İlerleme çubuğu
* Alfabetik kullanıcı listeleme
* Profil fotoğrafı gösterimi

---

## Gelişmiş Özellikler (v1.4.1)

* Takipçi listesi görüntüleme
* Gizli hesap filtresi
* Verified hesap rozeti
* Checkbox ile kullanıcı seçimi
* Tekli takipten çıkma
* Çoklu kullanıcıyı takipten çıkarma
* Listedeki tüm kullanıcıları takipten çıkarma
* Toplu işlem sistemi
* İşlem ilerleme göstergesi
* Batch işlem sistemi
* Güvenli gecikme mekanizması
* İşlem sonrası görsel buton geri bildirimi
* Unfollow işlemleri için otomatik mola sistemi
* Mola sırasında geri sayım göstergesi

---

# Kullanım

## 1. Instagram'a giriş yapın

Tarayıcı üzerinden:

```
https://www.instagram.com
```

adresine gidin ve hesabınıza giriş yapın.

---

## 2. Geliştirici Konsolunu Açın

### Windows

```
Ctrl + Shift + J
```

### MacOS

```
⌘ + ⌥ + I
```

---

## 3. Scripti Çalıştırın

Script kodunu **konsola yapıştırın** ve Enter tuşuna basın.

Script çalıştırıldığında sayfanın üzerinde bir **kontrol paneli** açılır.

---

## 4. Analizi Başlatın

Panelde:

```
Analizi Başlat
```

butonuna tıklayın.

Daha sonra Instagram **kullanıcı adınızı girin.**

Script aşağıdaki verileri çeker:

* Takipçiler
* Takip edilenler

---

# Arayüz

Script çalıştırıldığında sayfanın üstünde bir **analiz paneli** oluşturulur.

Panel iki bölümden oluşur.

---

## Sol Menü

Sol tarafta aşağıdaki seçenekler bulunur:

* Analizi Başlat
* Takipçiler
* Takip Etmeyenler
* Geri Takip Etmediklerim
* Gizli Hesapları Gizle
* Takipçiler (.csv)
* Takip Edilenler (.csv)

---

## Kullanıcı Listesi

Kullanıcılar aşağıdaki bilgilerle listelenir:

* Profil fotoğrafı
* Kullanıcı adı
* Tam isim
* Verified rozet
* Gizli hesap göstergesi
* Takipten çık butonu

---

# Takip Etmeyenleri Bulma

```
Takip Etmeyenler
```

butonuna bastığınızda:

Sizi takip etmeyen kullanıcılar listelenir.

Her kullanıcı için şu bilgiler gösterilir:

* Profil fotoğrafı
* Kullanıcı adı
* Tam isim
* Verified hesap
* Gizli hesap göstergesi

---

# Geri Takip Etmediklerim

```
Geri Takip Etmediklerim
```

butonu ile:

Sizi takip eden fakat sizin takip etmediğiniz kullanıcılar bulunur.

Bu listeyi analiz ederek **geri takip yapabilirsiniz.**

---

# Takipten Çıkma Özelliği

Script üzerinden doğrudan **takipten çıkabilirsiniz.**

Her kullanıcının yanında:

```
Takipten Çık
```

butonu bulunur.

Bu buton ile **tekli unfollow** yapılabilir.

Başarılı işlem sonrası buton **yeşile döner.**

---

# Çoklu Seçim (Checkbox)

Her kullanıcının yanında bir **checkbox** bulunur.

Birden fazla kullanıcı seçebilirsiniz.

Seçim yaptığınızda ekranda bir panel görünür:

```
X kişi seçildi
Seçilenleri Takipten Çık
```

Bu buton ile seçilen kullanıcılar **toplu olarak takipten çıkarılır.**

---

# Tümünü Takipten Çık

Bazı listelerde ayrıca şu buton bulunur:

```
Görünenleri Takipten Çık
```

Bu seçenek listedeki tüm kullanıcıları takipten çıkarır.

⚠️ Bu işlem geri alınamaz.

---

# Gizli Hesap Filtresi

Panelde bulunan seçenek:

```
Gizli Hesapları Gizle
```

aktif edildiğinde:

* Private hesaplar listede gösterilmez.

---

# CSV Export

Script aşağıdaki listeleri CSV olarak indirebilir:

* Takipçiler
* Takip Edilenler

CSV dosyası şu bilgileri içerir:

* Username
* Full Name
* Verified
* Private

Dosyalar:

* Excel
* Google Sheets
* LibreOffice

ile açılabilir.

---

# Teknik Detaylar

Script aşağıdaki sistemleri kullanır:

* Instagram GraphQL API
* Instagram Web API
* Async Fetch
* Batch Request sistemi
* Rate limit koruması
* DOM tabanlı arayüz oluşturma

---

## Kullanılan Endpointler

```
/graphql/query/
/api/v1/users/web_profile_info/
/api/v1/web/friendships/{userId}/unfollow/
```

---

# Rate Limit Koruması

Instagram tarafından engellenmemek için script gecikmeler kullanır.

Varsayılan ayarlar:

| İşlem                          | Süre       |
| ------------------------------ | ---------- |
| İstekler arası bekleme         | 2 saniye   |
| Batch veri çekme               | 5 istek    |
| Batch sonrası bekleme          | 50 saniye  |
| Unfollow arası bekleme         | 20 saniye  |
| Unfollow batch                 | 5 işlem    |
| Unfollow batch sonrası bekleme | 300 saniye |

Bu değerler script içinde değiştirilebilir.

---

# Performans

Takipçi sayısına göre analiz süresi değişebilir.

| Takipçi Sayısı | Tahmini Süre |
| -------------- | ------------ |
| 500            | ~1 dakika    |
| 1000           | ~2 dakika    |
| 5000           | ~8–10 dakika |
| 10000+         | 15+ dakika   |

---

# Güvenlik

Script:

* Tarayıcı içinde çalışır
* Harici sunucuya veri göndermez
* Hesap bilgilerini kaydetmez
* Tüm işlemler **lokal olarak yapılır**

---

# Notlar

* Çok fazla işlem yapılması Instagram tarafından geçici olarak engellenmenize neden olabilir
* Script sadece erişilebilir hesapların verilerini çekebilir
* Instagram API değişikliklerinde güncelleme gerekebilir

---

# Script Versiyonu

```
1.4.1
```

---

# Yasal Uyarı

Bu araç **Instagram ile resmi olarak ilişkili değildir.**

Instagram API değişiklikleri nedeniyle zaman zaman çalışmayabilir.

Kullanım tamamen **kullanıcının sorumluluğundadır.**

---

# Lisans

MIT License

---

# Katkıda Bulunma

1. Repository'yi fork edin

2. Feature branch oluşturun

```
git checkout -b feature/amazing-feature
```

3. Değişiklikleri commit edin

```
git commit -m "Add some amazing feature"
```

4. Branch'i push edin

```
git push origin feature/amazing-feature
```

5. Pull Request açın
