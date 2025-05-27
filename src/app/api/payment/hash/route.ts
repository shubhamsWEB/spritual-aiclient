import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: NextRequest) {
  try {
    const {
      key,
      txnid,
      amount,
      productinfo,
      firstname,
      email,
      phone,
      udf1 = '',
      udf2 = '',
      udf3 = '',
      udf4 = '',
      udf5 = '',
      udf6 = '',
      udf7 = '',
      udf8 = '',
      udf9 = '',
      udf10 = ''
    } = await request.json();

    const salt = process.env.NEXT_PUBLIC_PAYU_SALT || '';

    if (!salt || !key || !txnid || !amount || !productinfo || !firstname || !email) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    // Log for debugging
    console.log('Generating PayU hash with:', {
      key, txnid, amount, productinfo, firstname, email
    });

    // Generate hash for PayU
    // Formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt)
    const hashString = `${key}|${txnid}|${amount}|${productinfo}|${firstname}|${email}|${udf1}|${udf2}|${udf3}|${udf4}|${udf5}|${udf6}|${udf7}|${udf8}|${udf9}|${udf10}|${salt}`;
    
    const hash = crypto.createHash('sha512').update(hashString).digest('hex');

    console.log('Generated hash:', hash);

    return NextResponse.json({ hash });
  } catch (error: any) {
    console.error('Error generating PayU hash:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred while generating hash' },
      { status: 500 }
    );
  }
} 