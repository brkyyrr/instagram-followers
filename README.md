# Instagram Follower/Following Analyzer

[![Maintenance](https://img.shields.io/maintenance/yes/2026)](https://github.com/yourusername/instagram-follower-analyzer)

Tarayıcı üzerinden Instagram takipçilerinizi ve takip ettiklerinizi analiz etmenizi sağlayan bir araç. <u>Kurulum gerektirmez, doğrudan tarayıcı üzerinden çalışır!</u>

---

# Özellikler

## Temel Özellikler

* **Takipçileri ve takip edilenleri arayüzde listeleme (Yeni!)**
* Sizi takip etmeyenleri ve geri takip etmediklerinizi bulma
* Onaylı (verified) hesapları gösterme
* Gizli hesapları gösterme
* CSV olarak dışa aktarma
* Batch işleme (istekleri gruplar halinde yapar)
* İlerleme çubuğu ve geri sayım sayacı
* Instagram rate limiting koruması
* Türkçe karakter desteği

---

# Yeni Eklenen Özellikler

## v1.4.0 Güncellemesi (Takipçi Görüntüleme Desteği)

Bu sürümde, arka planda çekilen verilerin tam şeffaflıkla incelenebilmesi için takipçi listesi arayüzü eklenmiştir.

* **Takipçiler Butonu:** Artık sadece takip etmeyenleri değil, tüm takipçi listenizi arayüz üzerinden görebilirsiniz.
* **Gelişmiş Listeleme:** Takipçi listesi de alfabetik olarak sıralanır ve diğer listelerle aynı detay düzeyine (profil resmi, gizlilik durumu vb.) sahiptir.
* **Hız İyileştirmesi:** Veri çekme ve işlem gecikmeleri optimize edildi.

---

## v1.3.7 Güncellemesi (Tam Bütünlük & Syntax Fix)

* Gizli hesapları **tek tıkla gizleme filtresi**
* Görünen kullanıcıları **toplu takipten çıkarma**
* **Geri sayımlı mola sistemi**
* Unfollow işlemlerinde **otomatik batch yönetimi**
* İşlem sırasında **canlı durum göstergesi**
* İşlem tamamlandığında **yeşil buton geri bildirimi**

---

# Kullanım

### Adımlar

1. Instagram.com'a giriş yapın.
2. Tarayıcınızda geliştirici konsolunu açın (F12 veya Ctrl+Shift+J).
3. Script kodunu konsola yapıştırın ve **Enter** tuşuna basın.
4. Sayfada bir kontrol paneli açılacaktır.
5. Panelden **Analizi Başlat** butonuna basın ve kullanıcı adınızı girin.

---

# Arayüz

Script çalıştırıldığında sayfanın üstüne bir analiz paneli eklenir.

### Sol Menü

Panelde şu seçenekler bulunur:

* **Analizi Başlat:** Veri çekme işlemini başlatır.
* **Gizli Hesapları Gizle:** Listelerdeki gizli hesapları filtreler.
* **Takipçiler:** Tüm takipçi listenizi görüntüler.
* **Takip Etmeyenler:** Sizi takip etmeyenleri listeler.
* **Geri Takip Etmediklerim:** Sizin takip etmediğiniz takipçilerinizi listeler.
* **Takipçiler (.csv):** Listeyi dışa aktarır.

---

# Takipçileri Görüntüleme

**Takipçiler** butonuna bastığınızda:
* Sizi takip eden tüm kullanıcılar alfabetik olarak listelenir.
* Her kullanıcının profil resmi, onay durumu ve gizlilik bilgisi gösterilir.
* Bu liste üzerinden de tekli veya toplu takipten çıkma işlemleri yapılabilir.

---

# Teknik Detaylar

Script aşağıdaki sistemleri kullanır:
* Instagram GraphQL API & Web API
* Async/Await Fetch mimarisi
* Rate limit korumalı Batch sistemi
