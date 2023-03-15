import * as dotenv from 'dotenv'
import mongoose from 'mongoose'
import faker from 'faker'
import admin from '../firebase/admin'
import Admin from '../models/admin'
import Owner from '../models/owner'
import Renter from '../models/renter'
import User from '../models/user'
import Room from '../models/room'

dotenv.config()

const {DB_USERNAME, DB_PASSWORD, DB_NAME} = process.env
const MONGODB_URI = `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@cluster0.3ukly.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => console.log('Database connected ...'))
  .catch((error) => console.log('Could not connect to database ...', error.message))

const cities = ['hanoi', 'hcm', 'vungtau', 'dalat', 'danang', 'nhatrang', 'quangninh', 'hoian']
const roomTypes = ['MOTEL', 'APARTMENT', 'WHOLE_HOUSE', 'WHOLE_APARTMENT']
const bathroomTypes = ['PRIVATE', 'SHARED']
const kitchenTypes = ['PRIVATE', 'SHARED', 'NONE']
const images = [
  'https://firebasestorage.googleapis.com/v0/b/easy-accomod-57b04.appspot.com/o/images%2F1609229701652?alt=media&token=29dccb44-c7b0-4566-8640-d870521b7869',
  'https://firebasestorage.googleapis.com/v0/b/easy-accomod-57b04.appspot.com/o/images%2F1609229698362?alt=media&token=ad2b58d4-7a05-41b0-8dc7-a04ba4c1876a',
  'https://firebasestorage.googleapis.com/v0/b/easy-accomod-57b04.appspot.com/o/images%2F1609229706658?alt=media&token=767247b4-67bd-4ab6-962d-85a348e6f74c',
  'https://firebasestorage.googleapis.com/v0/b/easy-accomod-57b04.appspot.com/o/images%2F1609229710619?alt=media&token=d37c42f4-e0de-4bcd-8fbd-7bf7c3d3fe4e',
  'https://firebasestorage.googleapis.com/v0/b/easy-accomod-57b04.appspot.com/o/images%2F1609229790195?alt=media&token=bcc1be89-2a32-4e3f-bd8a-ed87b4a9896f',
  'https://firebasestorage.googleapis.com/v0/b/easy-accomod-57b04.appspot.com/o/images%2F1609229793716?alt=media&token=f05a0264-cbb2-4876-b762-856e83d0635e',
  'https://firebasestorage.googleapis.com/v0/b/easy-accomod-57b04.appspot.com/o/images%2F1609229796740?alt=media&token=60d3b488-8592-44f2-bbb8-aba6eadda440',
  'https://firebasestorage.googleapis.com/v0/b/easy-accomod-57b04.appspot.com/o/images%2F1609229690542?alt=media&token=c4a7c97e-a1fb-4fc0-af85-12a1de31444e',
]
admin
  .auth()
  .createUser({
    email: 'admin@gmail.com',
    password: '123456',
  })
  .then(async (userRecord) => {
    const newAdmin = new Admin({email: 'admin@gmail.com', name: 'Admin'})
    await newAdmin.save()

    const newUser = new User({roles: ['admin'], _id: userRecord.uid, admin: newAdmin._id})
    await newUser.save()
    console.log('Created admin')
  })
  .catch((error) => {
    console.log('Error creating new user:', error)
  })

for (let i = 0; i < 3; i += 1) {
  admin
    .auth()
    .createUser({
      email: `owner${i + 1}@gmail.com`,
      password: '123456',
    })
    .then(async (userRecord) => {
      const newOwner = new Owner({
        email: `owner${i + 1}@gmail.com`,
        name: faker.name.findName(),
        identity: faker.finance.creditCardNumber(),
        address: faker.address.streetAddress(),
        phone: '0968123456',
        status: 'APPROVED',
      })
      await newOwner.save()

      const newUser = new User({roles: ['owner'], _id: userRecord.uid, owner: newOwner._id, status: 'APPROVED'})
      await newUser.save()

      for (let j = 0; j < 32; j += 1) {
        const newRoom = new Room({
          owner: newOwner._id,
          roomType: roomTypes[j % 4],
          name: faker.name.findName(),
          description: `Một căn phòng tràn ngập ánh nắng, cây và sách. Vô cùng thoáng đãng và thoải mái. Bạn có thể ngắm hoàng hôn tím lịm phía chân trời, giữa những tòa nhà, nghe tiếng rao văng vẳng của những người bán dạo. Đúng chất Hà Nội, San's Homestay nằm trong một khu chung cư cũ nhưng căn hộ được tự tay San chăm bẵm, trang trí. Bạn có thể tìm thấy nhiều điều thú vị xung quanh khu nhà.
          Hiện San đang học tập và sinh sống ở nước ngoài, để được hỗ trợ, vui lòng liên hệ Ms. Giang. San's Home là căn hộ chia sẻ, quản gia sẽ ở một phòng riêng cùng căn hộ.       
          Chúng tôi dành tất cả những gì tuyệt vời nhất cho căn hộ xinh đẹp này để chờ đến ngày được chào đón bạn. Thiết kế chủ đạo với tông màu trắng cùng nội thất tốt giúp ngôi nhà trẻ trung và ấm cúng, mang đến cho bạn cảm giác như đang ở trong chính ngôi nhà của mình vậy.
          Bên cạnh đó, chúng tôi cũng là một người địa phương vô cùng thân thiện và thoải mái. Chúng tôi cùng chia sẻ căn hộ với bạn, chính vì vậy đừng ngại ngần chia sẻ với chúng tôi những điều bạn đang thắc mắc hoặc những khó khăn bạn gặp phải khi ở đây nhé!`,
          area: 30,
          rule: `Là căn hộ chia sẻ, quản gia sẽ ở một phòng riêng cùng căn hộ để hỗ trợ bạn.
          Hãy báo với San giờ giấc check in check out dự kiến của bạn, mọi thứ đều linh hoạt, đừng lo.
          Chú ý khi sử dụng những không gian chia sẻ: nhà bếp, nhà tắm, phòng khách... thật nhẹ nhàng, gọn gàng và sạch sẽ.
          Đừng ngại yêu cầu/góp ý bất cứ điều gì, chúng ta sẽ cùng giải quyết nó.`,
          city: cities[j % 8],
          address: faker.address.streetAddress(),
          bathroomType: bathroomTypes[j % 2],
          kitchenType: kitchenTypes[j % 3],
          hasWaterHeater: j % 2 === 0,
          hasConditioner: j % 2 === 1,
          hasBalcony: j % 2 === 1,
          hasFridge: j % 2 === 0,
          hasBed: j % 2 === 0,
          hasWardrobe: j % 2 === 1,
          roomPrice: 1000000 * (j % 4) + 500000,
          waterPrice: 50000,
          electricityPrice: 5000,
          isWithOwner: j % 2 === 1,
          isExpired: false,
          expiredDate: Date.now(),
          views: 0,
          isRent: false,
          status: 'APPROVED',
          images: images.sort(() => Math.random() - 0.5),
        })
        newRoom.save()
      }
    })
    .catch((error) => {
      console.log('Error creating new user:', error)
    })
}

for (let i = 3; i < 6; i += 1) {
  admin
    .auth()
    .createUser({
      email: `owner${i + 1}@gmail.com`,
      password: '123456',
    })
    .then(async (userRecord) => {
      const newOwner = new Owner({
        email: `owner${i + 1}@gmail.com`,
        name: faker.name.findName(),
        identity: faker.finance.creditCardNumber(),
        address: faker.address.streetAddress(),
        phone: '0968123456',
        status: 'PENDING',
      })
      await newOwner.save()

      const newUser = new User({roles: ['owner'], _id: userRecord.uid, owner: newOwner._id, status: 'PENDING'})
      await newUser.save()
      console.log(newOwner)
    })
    .catch((error) => {
      console.log('Error creating new user:', error)
    })
}
