# Instagram Follower/Following Analyzer

[![Maintenance](https://img.shields.io/maintenance/yes/2024)](https://github.com/yourusername/instagram-follower-analyzer)

Tarayıcı üzerinden Instagram takipçilerinizi ve takip ettiklerinizi analiz etmenizi sağlayan bir araç.  
<u>Kurulum gerektirmez, doğrudan tarayıcı üzerinden çalışır!</u>

## Özellikler

- Takipçileri ve takip edilenleri ayrı ayrı görüntüleme
- Onaylı (verified) hesapları filtreleme
- Gizli hesapları filtreleme
- CSV olarak dışa aktarma
- Batch işleme (40'ar kullanıcı)
- İlerleme çubuğu
- Instagram rate limiting koruması

## Kullanım

### Adımlar:

1. Instagram.com'a giriş yapın
2. Tarayıcınızda geliştirici konsolunu açın:
   - Windows: `Ctrl + Shift + J`
   - Mac OS: `⌘ + ⌥ + I`
3. Kodu konsola yapıştırın ve Enter'a basın
4. Açılan arayüzde:
   - "Takipçileri Getir" butonu ile takipçilerinizi görüntüleyin
   - "Takip Edilenleri Getir" butonu ile takip ettiklerinizi görüntüleyin
   - Her liste için CSV olarak dışa aktarma yapabilirsiniz

## Ekran Görüntüleri

[Ekran görüntülerini buraya ekleyin]

## Teknik Detaylar

- Instagram API kullanır
- Rate limiting için 10 saniye bekleme süresi
- Her seferde 40 kullanıcı çeker
- Türkçe karakter desteği
- Responsive tasarım

## Notlar

- **Çok sayıda takipçisi olan hesaplar için işlem uzun sürebilir**
- **Instagram'ın rate limiting politikaları nedeniyle beklemeler olabilir**
- **Sadece public profillerin takipçi listesine erişilebilir**

## Geliştirici Notları

- Node.js sürümü: 16.14.0 ve üzeri önerilir
- Kod güncellemeleri için rate limiting değerlerini ayarlayabilirsiniz
- Instagram API değişikliklerinde güncelleme gerekebilir

## Yasal Uyarı

**Bu araç Instagram ile resmi olarak ilişkili değildir. Instagram'ın API politikalarına uygun olarak geliştirilmiştir.**

Kendi sorumluluğunuzda kullanın!

## Lisans

MIT License

## Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın 
