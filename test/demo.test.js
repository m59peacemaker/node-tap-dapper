const test = require('tape')

test('shoots the sheriff and the deputy', t => {
  t.plan(2)
  t.pass('shot the sheriff')
  t.fail('did not shoot the deputy')
  console.log('I say')
})


test('I shot the sheriff', t => {
  t.plan(1)
  t.pass('')
})

test('the bucket goes to the well', t => {
  t.plan(1)
  t.equal({when: 'today'}, {when: 'one day'}, 'bottom dropped out')
})
