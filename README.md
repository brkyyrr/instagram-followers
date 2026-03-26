# Instagram Follower / Following Analyzer

[![Maintenance](https://img.shields.io/badge/maintained-yes-green)]()

Instagram takipçi ve takip edilen analizini **tarayıcı üzerinden doğrudan yapmanızı sağlayan, yüksek güvenlikli bir JavaScript aracıdır.** Kurulum gerektirmez. Scripti **tarayıcı konsoluna yapıştırarak çalıştırabilirsiniz.**

---

# Özellikler

## Temel Özellikler
* **Hızlı Analiz:** Takipçi ve takip edilen listelerini paralel (eş zamanlı) olarak çeker.
* **Sizi Takip Etmeyenler:** Tek tıkla sizi takip etmeyenleri listeler.
* **Alfabetik Sıralama:** Tüm listeler otomatik olarak A'dan Z'ye sıralanır.
* **Profil Detayları:** Profil fotoğrafı, tam isim ve gizlilik durumu (🔒) gösterimi.
* **Doğrulanmış Hesap Desteği:** Verified (✓) rozetlerini tanır.

---

## Gelişmiş Güvenlik ve İşlem (v1.8.1)
* **Gelişmiş İstek Motoru:** Instagram'ın modern Web API'si ile tam uyumlu CSRF ve Header yönetimi.
* **"Sırada" Bekleme Çözümü:** İsteklerin askıda kalmasını engelleyen kimlik doğrulama sistemi.
* **Dinamik Log Paneli:** İşlem sırasındaki tüm süreçleri ve molaları anlık olarak panelden takip edebilirsiniz.
* **Akıllı Filtreleme:** Gizli hesapları listelerde isteğe bağlı olarak gizleme.
* **Toplu Unfollow Sistemi:** Checkbox ile seçilen kullanıcıları güvenli aralıklarla takipten çıkarma.
* **İnsansı Gecikme Mekanizması:** Her işlem arasında 25-45 saniye arası rastgele bekleme.
* **Otomatik Güvenlik Molası:** Her 5 işlemde bir 5 dakikalık zorunlu mola ve geri sayım sayacı.
* **Modern Karanlık Tema:** Instagram arayüzü ile uyumlu, sabitlenmiş profesyonel panel.

---

# Kullanım

## 1. Instagram'a giriş yapın
Tarayıcı üzerinden [instagram.com](https://www.instagram.com) adresine gidin ve hesabınıza giriş yapın.

---

## 2. Geliştirici Konsolunu Açın
* **Windows:** `Ctrl + Shift + J`
* **MacOS:** `⌘ + ⌥ + I`

---

## 3. Scripti Çalıştırın
Script kodunu kopyalayıp **konsola yapıştırın** ve Enter tuşuna basın. Sayfanın üzerinde analiz paneli açılacaktır.

---

## 4. Analizi Başlatın
1. **Analizi Başlat** butonuna tıklayın.
2. Instagram **kullanıcı adınızı** girin.
3. Script paralel olarak verileri çekmeye başlar ve ilerleme durumunu log panelinde gösterir.

---

# İşlem Paneli Detayları

### Sol Menü (Kontroller)
* **Analizi Başlat:** Veri çekme sürecini tetikler.
* **Gizli Hesap Filtreleri:** Takipçi veya Takip Edilen listelerindeki gizli hesapları anlık filtreler.
* **Kategori Butonları:** Takipçiler, Takip Edilenler ve Takip Etmeyenler listeleri arasında geçiş sağlar.

### Toplu İşlem Paneli
Bir veya birden fazla kullanıcıyı yanındaki kutucuktan (checkbox) seçtiğinizde, ekranın sol altında **"Seçilenleri Takipten Çık"** butonu belirir. Bu buton, güvenli modda toplu işlemi başlatır.

---

# Güvenlik ve Hız Sınırları (v1.8.0)

Instagram limitlerine takılmamak için aşağıdaki güvenli değerler uygulanmaktadır:

| İşlem | Açıklama | Süre |
| :--- | :--- | :--- |
| **Veri Çekme Gecikmesi** | Her 50 kullanıcıda bir bekleme | 5 Saniye |
| **Unfollow Gecikmesi** | İşlemler arası rastgele bekleme | 25 - 45 Saniye |
| **İşlem Grubu (Batch)** | Mola öncesi maksimum işlem | 5 Kullanıcı |
| **Güvenlik Molası** | Batch sonrası zorunlu bekleme | 300 Saniye (5 dk) |

---

# Teknik Altyapı
* **Instagram GraphQL API:** Veri listeleme için query hash kullanımı.
* **Instagram Web API v1:** Takipten çıkma ve profil sorgulama işlemleri.
* **CSRF Protection:** Oturum çerezleri ve token yönetimi.
* **Async/Await:** Donma yapmayan akıcı işlem süreci.

---

# Versiyon Notları

### v1.8.0 (Son Güncelleme)
* **[Yeni]** Instagram'ın yeni güvenlik protokolleri için `X-Instagram-AJAX` ve `X-CSRFToken` başlıkları eklendi.
* **[Yeni]** Takipten çıkma işlemindeki "Sırada" takılma sorunu `credentials: 'include'` eklenerek çözüldü.
* **[Yeni]** İşlem durumunu takip eden kalıcı Log Paneli eklendi.
* **[Yeni]** 5 dakikalık güvenlik molası ve geri sayım sayacı eklendi.
* **[Güncelleme]** Veri çekme hızı `Promise.all` ile optimize edildi.
* **[Kaldırıldı]** v1.4.1'de bulunan ancak stabil çalışmayan CSV Export özelliği pasif olduğu için temizlendi.
* **[Düzeltme]** Liste değişikliklerinde arayüzün bozulmasına neden olan DOM hataları giderildi.

---

# Yasal Uyarı
Bu araç eğitim amaçlı geliştirilmiştir ve **Instagram ile resmi bir bağı yoktur.** Çok sık kullanım hesap kısıtlamalarına yol açabilir. Tüm sorumluluk kullanıcıya aittir.

---

# Lisans
MIT License