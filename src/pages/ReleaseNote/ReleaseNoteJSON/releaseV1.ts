import { ReleaseNoteInterface } from '../../../interface/common';

const releaseV1: ReleaseNoteInterface[] = [
  {
    version: '2.0.27',
    release_date: 'April 7, 2025',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5434 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>When I open my offers to do, there are so many columns that I keep having to make FM bigger just to see them all.  It is almost taking over my whole monitor.  I do not need to see alot of the columns.  Can we make it to where we can hide columns (like on Excel).  I know you are supposed to be making it so where we can make them sized differently, but I don't even need to see them.  I don't like having to make FM almost as big as my monitor because I need to see things under it.</span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.26',
    release_date: 'April 4, 2025',
    sections: [
      {
        title: {
          name: 'What’s New',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                              <span style="text-align: justify;">
                              FM-5267<span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: start;
                              margin-right: 5px;
                              margin-left: 5px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> Cyndi price <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: start;
                              margin-right: 5px;
                              margin-left: 5px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> I provide a drafts due report to divisionorders on Slack every Friday. I pull it from Search -
Deeds - Drafts Due. Attached is what the formatting looks like now. I normally print the report, scan it to PDF Expert
and add notes - then upload to slack. Today's report was long (16 entries) and when I went to print it, it said there
were two pages but the second page was blank so I had to write in the entry that was supposed to be on page two.
Additionally - the date in the last column was partially cut off. Can we make a "print"version of this report so it is
complete and I don't have to write entries in?
                          </span>
                        </li>
                        <li style="display: flex; margin: 8px 0; margin-top: 20px; margin-left: 30px;">
                          <b>Draft Due Table:</b>
                        </li>
                        <ul style="list-style: none; padding: 0; margin-left: 50px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> A "Draft Due" table has been added to the dashboard page with a "Notes" field to add and update note
details.
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> For every update, a note will be created, and the note history will be maintained with the type as 'Draft Due'
under the File Notes section.
                          </li>
                                <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> Only the Buyer and Division Order Department can edit the Draft Due details on the dashboard page.
                          </li>
                        </ul>
                        <li style="display: flex; margin: 8px 0; margin-top: 20px; margin-left: 30px;">
                          <b>New Wells, Offers, and Deal Table:</b>
                        </li>
                        <ul style="list-style: none; padding: 0; margin-left: 50px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> A new table view and graph view have been implemented on the homepage to track goals and
achievements for new wells, offers, and deal details.
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> Only the Buyer and Division Order Department can edit the values in the New Wells, Offers, and Deal
details on the dashboard page.
                          </li>
                                                  <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> By default, the graph displays data for only a recent years in the minimized view. Clicking on the maximize option reveals data from previous years as well. A horizontal scroll bar is also available to navigate and view the entire chart.
                          </li>
                                                  <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> Clicking on a legend (month) will hide the corresponding data series from the graph. Clicking it again will restore the data.
                          </li>
                        </ul>
                      </ul>`,
            type: 'video',
            src: '/assets/rel-2.0-draft-due-record.mp4',
          },
        ],
      },
      {
        title: {
          name: 'Improvements',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                FM-4888<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tamara Maxwell <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Thank you to whomever was on my computer helping to widen the page however,
I'm still not able to see Zip in address and the Date of Birth/Date of Death box normally to the right of the addresses.
                              </span>
                            </li>
                                                    <li style="display: flex; margin: 8px 0; margin-top: 20px; margin-left: 30px;">
                          <b>Newly Implemented Table Features (across the application):</b>
                        </li>
                            <ul style="list-style: none; padding: 0; margin-left: 50px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> A "Manage Column" feature has been implemented to control which columns are displayed in the table.
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> A "Reset" option has been implemented to restore and display all columns in the table.
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> A "Pin" and "Hide" option have been added to the table columns, allowing users to pin or hide columns as
needed.
                          </li>
                                                 <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> Reordering is allowed, enabling users to shuffle the table columns by dragging
                          </li>
                                                                           <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> A Resizing feature is available, allowing users to adjust column widths as needed
                          </li>
                        </ul>
                      </ul>`,
            type: 'video',
            src: '/assets/rel-2.0-table-improvements.mp4',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                FM-4892<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Maybe to help with this issue, we could change some of the column widths.  Like the Draft 1 & the State column does not have to be that big.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">3.</span>
                                <span style="text-align: justify;">
                                FM-5421<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Lori Hauge <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> We need to add an option for "Successor Trustee" to the list of options for "New Title"
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.25',
    release_date: 'March 25, 2025',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5407 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>I notice that when I am typing a note in FileMaster and I have to go to the internet or another source to find information my note "disappears".  When I click back in the blank note space the note shows back up and I can add to it but sometimes I need to refer to the note I am typing to find information needed to complete it.  Can you make it so the copy stays constant and does not "disappear" if you briefly go to another source?
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.24',
    release_date: 'March 21, 2025',
    sections: [
      {
        title: {
          name: 'Improvements',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                FM-5401 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>We received notification from Sage Natural Resources that they sold all of their Barnett Shale assets to EagleRidge Operating LLC.  I just attempted to use the "update all wells" feature in wellmaster so I wouldn't have to manually enter the changed for all of our Lenox Wells located in Tarrant County, TX.  It worked for the operator column but did not work for the payor column.  I manually changed a couple to see if I could get the system to cooperate but could not.  Can you please tweek this feature a bit so if both columns need to be changes it is easier?  Sometimes it is only one that needs to change and sometimes it is both.  Thank You. 
                              </span>
                            </li>
                            <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                               A confirmation pop-up has been added for the Payor, similar to the Operator. Additionally, another scenario has been included where the pop-up appears when both the Payor and Operator are updated, and the user clicks Save
                              </span>
                            </li>
                            <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                                When a user modifies the payor and attempts to save, a pop-up will appear with the following message:
                              </span>
                            </li>
                            <li style="display: flex; margin: 8px 0; margin-left: 45px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                                "Do you want to apply this change to all wells with this payor?"
                              </span>
                            </li>
                            <li style="display: flex; justify-content: center; margin: 10px 0;">
  <img src="/assets/rel-2.0-payor-popup.png" alt="Wellmaster payor Update" style="max-width: 100%; height: auto;">
</li>
                               <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                                When a user modifies the Payor and Operator and attempts to save, a pop-up will appear with the following message:
                              </span>
                            </li>
                            <li style="display: flex; margin: 8px 0; margin-left: 45px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                                "Do you want to make this change for all wells with this operator and payor?"
                              </span>
                            </li>
                            <li style="display: flex; justify-content: center; margin: 10px 0;">
  <img src="/assets/rel-2.0-payor_opeartor-popup.png" alt="Wellmaster payor and opeator Update" style="max-width: 100%; height: auto;">
</li>
                            <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                                The pop-up provides three options:
                              </span>
                            </li>
                           <ul style="list-style: none; padding: 0; margin-left: 40px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Cancel → Dismisses the pop-up without making any changes.
                          </li>
                            <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Update This Well Only →  Applies the changes to the current well only.
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Update All Wells → Applies the changes to all wells associated with the same operator or payor.
                          </li>
                          </ul>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5406 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I went to do an offer for Donald F. Green.  In the OFFERS TO SEND view, it has the word "null" in the contact.  When you go to the contact, it is not there.
When I generate the offer, it is not there on the letter, but is there on the deed.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.23',
    release_date: 'March 18, 2025',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5389 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> When there is alternate name using "Individually and as ....", I usually put that in the letter.  With the new update it is not putting it in the letter.
I do not need it in the letter if it is just an a/k/a or f/k/a but if it says Ind. & as...I need it in the letter.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.22',
    release_date: 'March 14, 2025',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5293 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Bella Stoffel <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> The paper location, “as of date”, and check box for if the paper exists is not saving.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.21',
    release_date: 'March 11, 2025',
    sections: [
      {
        title: {
          name: 'Improvements',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                              <span style="text-align: justify;">
                              FM-5243<span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: start;
                              margin-right: 5px;
                              margin-left: 5px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> Lori Hauge <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: start;
                              margin-right: 5px;
                              margin-left: 5px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> When entering an addition to the name in the alternative name filed it is forcing us to choose "aka" or "fka" which doesn't apply when we are entering "Individually and as Trustee" and others that are similar.
                          </span>
                        </li>
                        <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                          <b>Title Enhancements:</b>
                        </li>
                        <ul style="list-style: none; padding: 0; margin-left: 50px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> The Contact Form now supports adding multiple titles.
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> Users can add titles using the "New Title" button.
                          </li>
                        </ul>
                        <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                          <b>Title Field Configuration:</b>
                        </li>
                        <ul style="list-style: none; padding: 0; margin-left: 50px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> Title field contains a checkbox called Individually And As, a dropdown field for Title, a Preposition field, and a text field for Entity Name.
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> If the Title field contains either Title, Preposition, or Entity Name but not the rest of the data, it will throw validation error.
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> The Individually And As checkbox is optional.
                          </li>
                        </ul>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2. Option to enter multiple alternate names</span> 
                          </span>
                        </li>
                        <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                          <b>Alternate Name Enhancements:</b>
                        </li>
                        <ul style="list-style: none; padding: 0; margin-left: 50px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> The Contact Form now supports adding multiple alternate names.
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> Users can add alternate names using the "New AltName" button.
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> Each alternate name must have a corresponding Alternate Name Format field.
                          </li>
                        </ul>
                        <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                          <b>Grantor Field Formatting:</b>
                        </li>
                        <ul style="list-style: none; padding: 0; margin-left: 50px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> If alternate names exist, the Grantor field in the "Make Offer" section will now follow this format :&nbsp;
                            <i>First Name Last Name AltNameFormat AltName AltNameFormat AltName</i>.
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> Example :&nbsp; <i>John Doe a/k/a Johnny Doe a/k/a Johns D</i>.
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> The same format applies to table displays for consistency.
                          </li>
                        </ul>
                        <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                          <b>Document Section Update:</b>
                        </li>
                        <ul style="list-style: none; padding: 0; margin-left: 50px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> In the Offer document, only the First Name and Last Name from the contact are used.
                          </li>
                         <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> If the document is not associated with an Offer, it follows the :&nbsp;  <i> First Name Last Name AltNameFormat AltName</i> &nbsp; from the contacts.
                          </li>
                           <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> For other documents: No changes.
                          </li>
                        </ul>
                        <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                          <b>Validation Enforcement:</b>
                        </li>
                        <ul style="list-style: none; padding: 0; margin-left: 50px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> The UI now prevents users from entering "a/k/a" or "f/k/a" (case-insensitive) in the Alternate Name field.
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> If an Alternate Name is entered but the Alternate Name Format is missing, a validation error is thrown.
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                              display: inline-flex;
                              justify-content: center;
                              align-items: center;
                              margin-right: 15px;
                              font-weight: bold;
                              font-size: 1.3rem;
                            ">•</span> If the Alternate Name is the same as the First Name and Last Name, a validation error is thrown.
                          </li>
                        </ul>
                      </ul>`,
            type: 'video',
            src: '/assets/rel-2.0-title-and-alt-name.mp4',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.20',
    release_date: 'March 7, 2025',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5307 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> The last few Oklahoma deeds, when I download them, are not formatted correctly. They should be on legal paper with margins of: 2" top margin, 1" on the bottom & sides. Not sure why it started doing this?.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5308 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> When someone sends me an offer with "As we discussed", it used to automatically add that to the offer letter.  It is no longer doing that.  I am having to type it in everytime.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.19',
    release_date: 'February 28, 2025',
    sections: [
      {
        title: {
          name: 'Improvements',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                FM-5289<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Thank you for adding the operator address to the division order screen.  Can you please add the city, state and zip as well.  The purpose of adding the address was so I don't have to go to the "operators" screen when I have to mail something to a company but since the city, state and zip don't appear, I still have to go back and forth.  Thank You.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.18',
    release_date: 'February 21, 2025',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5269 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Brooklyn Paz <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> There are several files where the urgent tasks are showing up in my list, even though if you go in the file, they say they're assigned to Tina. Also, they are showing up only when I go to "Urgent Tasks" from my dashboard, not when I go to "My Tasks" on my dashboard. for example, Turk, Bertie Lee file is one of the ones where I am getting the tasks in my urgent tasks list.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.17',
    release_date: 'February 14, 2025',
    sections: [
      {
        title: {
          name: 'Improvements',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify; margin-top: 5px;">
                                The edit option for the file name field has been disabled in both Wellmaster creation and edit form.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                FM-4902 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>This is an old issue but there needs to be a better way to make changes to information in Wellmaster.  For example, when I get an operator change notification I have to go into EVERY SINGLE well name entry and make the change - one by one.  Sometimes there are twenty to thirty wells in the same unit and this is very tedious and time consuming!!
                              </span>
                            </li>
                            <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                                A new confirmation pop-up has been added when updating the operator field in the Edit Wellmaster form.
                              </span>
                            </li>
                            <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                                When a user modifies the operator and attempts to save, a pop-up will appear with the following message:
                              </span>
                            </li>
                            <li style="display: flex; margin: 8px 0; margin-left: 45px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                                "Do you want to apply this change to all wells with this operator?"
                              </span>
                            </li>
                            <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                                The pop-up provides three options:
                              </span>
                            </li>
                           <ul style="list-style: none; padding: 0; margin-left: 40px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Cancel → Dismisses the pop-up without making any changes.
                          </li>
                            <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Update This Well Only → Updates the operator for the current well only.
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Update All Wells → Updates the operator for all wells associated with the same operator.
                          </li>
                          </ul>
                      </ul>`,
            type: 'image',
            src: '/assets/rel-2.0-wellmaster-operator-update.png',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.16',
    release_date: 'February 11, 2025',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4990 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tina Lewis <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I just updated the address' of 2 people in a file and saved it and it did not save the update. Joseph Grant Keil and  Daniel Keil. Lena H Pitcock Estate file
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5024<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I just entered these two similar wells into WellMaster.  The notes aded to the quarters section are usually very similar and tend to system used to "save" the notes added to a drop down that would appear when you typed in the first few letters of the note.  Can we please make it do that again.  Some division orders have 20 or so wells on them so it is tedious to have o enter the whole note each time when I used to be able to pull from the drop down & make the miror changes.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.15',
    release_date: 'February 6, 2025',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify; margin-top: 5px;">
                                If a file’s status is "Ready for Offer" and a buyer is assigned or changed, the status will automatically update to "Ready for Offer - Checked Out by Buyer" and move the file to Checked Out.
                                </span>
                              </span>
                            </li>
                            <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                                If a file has no status (empty) but a buyer is assigned, selecting "Ready for Offer" and saving will automatically update the status to "Ready for Offer - Checked Out by Buyer" and move the file to Checked Out.
                                </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.14',
    release_date: 'February 3, 2025',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5230 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I am working through my task list for the day and one of the tasks is to follow up on a notification on the Bryant Tucker file.  Attached is the prompt I keep getting when I try to access the previous notes.  I cannot complete my tasks if I cannot access the "Division Order" tab.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5206<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Hilcorp purchased all of Apache's assets in several TX and NM counties.  I have been updating the changes in WellMaster.  I got down to the final few and have attempted to make the changes but when I hit save the system will not save the change???  It worked fine on all the others.  This change needs to be applied to the Hendrick, Ida, Softail 10-17 1, Sportster 10-18H 3H, Springer 10-23 W/2 Unit All & Springer 10-23A 2H.  Thank You.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.13',
    release_date: 'January 31, 2025',
    sections: [
      {
        title: {
          name: 'Improvements',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                FM-5154 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Can we add a field for "Reference ID's" in the division order screen.  Most companies now have a general owner relations mailbox where emails go.  When received - they are issued a task or reference number that follows correspondence throughout the process.  I always add these emails to the notes but it would be nice if there was a field for these numbers that stood out better so I don't have to scroll through the notes to find the number when I make an inquiry.
                              </span>
                            </li>
                            <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                                It would also be nice if the operator address appeared along with the company name, phone number & email.  Currently, when I mail information to a company I have to go into the contact screen to get the address.  Not sure if that would make it look too cluttered but it would help avoid that extra step.
                                </span>
                            </li>
                      </ul>`,
            type: 'video',
            src: '/assets/rel-2.0-div-order-company-address.mp4',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                FM-4951 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> It appears that documents are being copied several times when added to docs.  See the Pamela Trochelman file.
                              </span>
                            </li>
                            <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                               <span style="text-align: justify;">
                                FM-5153 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I have reported this issue before but it continues to be a problem.  These are documents from the M E Sutphen file.  I closed the file out yesterday and had to update the family tree and tax bills.  When I do that, I delete the old entries as they are no longer valid.  As you can see, there are four copies of every entry so when I updated the family tree and the tax bills I had to delete four (original and 3 copies) of each doc.  in short, I had a family tree and 4 tax bills so I had to delete 20 documents to make the file correct and only have one entry per doc.  When there is only one entry per doc it saves recall time and also avoids confusion when scrolling through the docs in the file.  Please fix this issue
                              </span>
                                </span>
                            </li>
                           <ul style="list-style: none; padding: 0; margin-left: 40px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Multiple documents with the same name cannot be uploaded within a file or across deeds under the same file. The same validation applies to the renaming logic.
                          </li>
                            <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> A warning is provided when deleting a document if more than one document with the same name exists.
                          </li>
                          </ul>
                      </ul>`,
            type: 'video',
            src: '/assets/rel-2.0-upload-doc-validation.mp4',
          },
        ],
      },
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5179 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> It looks like it is putting the extra a/k/a in the offer letter & deed again.  It stopped doing it for a few days but is now back.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5198 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I have found one of the addresses I have for Northbrook Oil & Gas to be inaccurate.  I attempted to delete the information from the contact list so I would not use it in the future but I received a prompt stating there must be an email address.  There was not one to begin with and not all operators have an email address.  Please fix.  Thank You.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">3.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5186 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I am trying to access information in the "Suspense" tab of the William E Schevill file (Deed View) and here is the pop-up I keep getting??  I cannot access the information and have to go back to the dashboard, then back to the file.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.12',
    release_date: 'January 28, 2025',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5152 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>I am still experiencing trouble entering dates on many fields in the system.  I am used to tabbing through date entry and when you hit the tab key now it takes you to the "X" over by the calendar icon and then it is confusing to go back and type the date in.  Can we change it back to the other way where you can tab through the date and each digit is it's own entity instead of being the two digit month, two digit date and four digit year block?  This process is slowing me down.
                              </span>
                            </li>
                            <ul style="list-style: none; padding: 0; margin-left: 30px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Adjusted tab navigation to skip the "Clear" and "Date Picker" icons.
                          </li>
                            <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> The left and right arrow keys remain functional for navigating date field.
                          </li>
                          </ul>
                      </ul>`,
            type: 'video',
            src: '/assets/rel-2.0-date-field-tab-nav.mp4',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.11',
    release_date: 'January 24, 2025',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5017 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tina Lewis <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I'm noticing a red message under the email section on a contact “Please enter a valid email” but I don’t see anything wrong with the email address.  I have to delete the email to save information on the contact.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4991<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tina Lewis <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Jessie (Jesse) Randall Shoemake file.  Red message appearing to enter a valid DOB.  I have to click on the X and clear that to save anything in the contact. Then when I clear it and save the contact a red message is appearing under the email section "enter a valid email" . There does not appear to be anything wrong with the email. I have to delete the email to save anything on the contact. Thanks
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">3.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5160 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> My dashboard says I have 37 offers to send this morning.  When I go into offers to send, it says I have 107, but there is not 107 offers in the que.  Just wondering why the numbers do not match.
                              </span>
                            </li>
                            <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                            Update: Now I have 36 offers to do, but it says I have 116.  There is 31 on the 1st page & 5 on the 2nd page.  Confusing!
                                </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.10',
    release_date: 'January 21, 2025',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5085 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Brooklyn Paz <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I need to change all the numbers to Bad on a contact because they are disconnected, and when I go to save the contact it says "please enter a valid email". I am assuming this is because after the email address we wrote "- BAD" so in the future I know that it didn't work and not to use it. maybe we need to make the email field(s) the same as the phone fields, in that we can add more than 1 (because sometimes I find multiple on accurint) and be able to change whether they are Best, Bad, etc. This info would be helpful to have there instead of me having to go back and reference notes where I have included email addresses. Or at least change it so that "- BAD" is allowed in the email field because now I cannot save the changes to the phone numbers without removing that.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4900<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I just tried to ad a note to the Diamondback Division Order and the note will not save - additionally, there is no way to move to the next screen - After I save the notes I need to put the suspense amount in the "Suspense" screen but I con't find a way to navigate to it.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">3.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5130 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Lori Hauge <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Unable to add and email or make any changes to contact info on a file without checking one of the new aka or fka boxes.  Not all contacts will have an aka or fka so we need to be able to add info without having to check one of the boxes.  Sample error message attached.
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">4.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5140 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Lori Hauge <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Already submitted 1 ticket regarding these boxes.  Just discovered that these boxes also affect our ability to add additional contact info when dealing with a Trustee or a Managing Member and possible others.  It will not allow us to enter:
                            </li>
                            <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                            Individually and as Trustee
                                </li>
                             <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                           Individually and as Managing Member
                                </li>
                             <li style="display: flex; margin: 8px 0; margin-left: 30px;">
                             Possible others
                                </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">5.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5141 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I am trying to close out all the deeds in the Ida Burkett file but the system won't let me save my changes because of the a/k/a/f/k/f changes.
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">6.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5139 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> It looks like when there is an "Alternative Name" in the contact, when it generates the letter & offer, it is adding "a/k/a" automatically.  It should not add that.  It should just put what has been written in the field.
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.9',
    release_date: 'January 17, 2025',
    sections: [
      {
        title: {
          name: "What's New",
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">1.</span>
                                <span>Added a "Delete Recording" option on the Edit Recording page to allow users to delete specific recording.</span>
                            </li>
                      </ul>`,
            type: 'image',
            src: '/assets/rel-2.0-delete-recording.png',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">2.</span>
                                <span>Added Validation  message for the "Alternative Name" field to ensure it is not the same as the Contact First Name and Last Name, and to check if the alternative name consists of a single name. This validation message has been implemented on the following pages:</span>
                            </li>
                        <ul style="list-style: none; padding: 0; margin-left: 30px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Add New file
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Add Contact   
                                                    </li>
                                                                              <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Edit contact
                                                    </li>
                                                                              <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Edit Deed (Contact section)

                                                   
                                                </ul>
                        </ul>`,
            type: 'image',
            src: '/assets/rel-2.0-altname-validation-1.png',
          },
          {
            content: `<div style="margin:0px" />`,
            type: 'image',
            src: '/assets/rel-2.0-altname-validation-2.png',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">3.</span>
                                <span style="text-align: justify;">
                                a/k/a and f/k/a format have been introduced in the Contact section page to allow users to select the format for the alternate name. The radio button option is mandatory if an alternative name is provided.
                              </span>
                            </li>
                            <li style="display: flex; margin: 8px 0; margin-left: 35px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                                a/k/a and f/k/a format details will display in below listed letters
                                </span>
                                </li>
                          <ul style="list-style: none; padding: 0; margin-left: 50px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Offers letters

                    </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Deed letter
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Deed Received letter
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Probate letter   
                                                  </li>
                            </ul>
                            <li style="display: flex; margin: 8px 0; margin-left: 35px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                                Grantor is replaced with first name, last name and alternative name in below listed letters
                                </span>
                                </li>
                          <ul style="list-style: none; padding: 0; margin-left: 50px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Offers letters

                    </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Deed letter
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Deed Received letter
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Probate letter   
                                                  </li>
                            </ul>                      </ul>`,
            type: 'image',
            src: '/assets/rel-2.0-aka-format.png',
          },
        ],
      },
      {
        title: {
          name: 'Improvements',
          sx: 'header1',
        },
        details: [
          {
            content: `
            <ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">1.</span>
                                <span>Improved device responsiveness for navigation menus and date pickers on medium-sized screens.
                              </span>
                            </li>
                        </ul>
                        `,
            type: 'text',
            src: '',
          },
          {
            content: `
            <ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">2.</span>
                                <span>Users are now redirected back to the originating view (e.g., deed or contact) after creating or deleting tasks
                              </span>
                            </li>
                        </ul>
                        `,
            type: 'text',
            src: '',
          },
          {
            content: `
            <ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">3.</span>
                                <span>Improved screen view for expanding and closing release note details, ensuring no lag
                              </span>
                            </li>
                        </ul>
                        `,
            type: 'text',
            src: '',
          },
          {
            content: `
            <ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">4.</span>
                                <span>Improved tab navigation function for Print file and Print deed button in File and Deed
                              </span>
                            </li>
                        </ul>
                        `,
            type: 'text',
            src: '',
          },
        ],
      },
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5078 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tina Lewis <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>When in the Task view on file master below the task is the option to "save the contact" and "delete the contact". There is never an occasion that I would delete the entire contact and all the information connected to it when I am working with tasks. This option makes it very easy to delete everything when working with tasks. In my opinion it would make more sense to have the option of "save the task" or  "delete the task" in this area. Thanks for considering. I talked to Seth about this early on and he agrees. I am not sure if he submitted a ticket or not.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4998<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tina Lewis <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> This makes it very easy to delete all the contact information, notes and tasks connected to the person. Perhaps the option to delete or save a contact should be on the face of the file or somewhere else?
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">3.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5001 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> On some of the offers, if there is an a/k/a in the name, it looks like it is putting the last name twice (I only noticed this once)
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">4.</span>
                                Resolved initial invalid date validation during the first bundle load.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.8',
    release_date: 'January 13, 2025',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5000 Fixed<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tina Lewis <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> When I CREATE a new task it shows that I created it.  If I UPDATE a current task that was assigned to me (for example: assign it a new date) it does not show that I created the task.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5016 Fixed as part of FM-5022<span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tina Lewis <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Looks like some dates are backwards (e.g. 1934-08-00) and it is preventing me from saving edits to a contact
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">3.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5026 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tina Lewis <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I have several tasks in my task list that are Aaron’s files and the tasks are assigned to Brooklyn. Brooklyn also has some of Steve’s files that are assigned to me in her task list.  Also when I logged in the task number was higher it has gone down and I have not completed any of them yet.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">4.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5029 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tina Lewis <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I already submitted a ticket on this but need to revise it. The new offer tasks are appearing on both task lists regardless of who the task is assigned to and when the task is completed if is removed from both task lists. I already sent a picture showing Aarons offers out assigned to Brooklyn on my task list. She did some of the tasks so that is why my number total of tasks changed without me completing any of them.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.7',
    release_date: 'January 10, 2025',
    sections: [
      {
        title: {
          name: "What's New",
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">1.</span>
                                <span>The constant date and year in the following documents have been dynamically updated to the date of document generation.</span>
                            </li>                              
                          <ul style="list-style: none; padding: 0; margin-left: 30px;">
                            <li style="display: flex; align-items: center; margin: 8px 0;">
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Deed Letter
                            </li>
                            <li style="display: flex; align-items: center; margin: 8px 0;">
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Deed Received Letter
                            </li>
                            <li style="display: flex; align-items: center; margin: 8px 0;">
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Offer Letter
                            </li>
                            <li style="display: flex; align-items: center; margin: 8px 0;">
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Offer Postcard Letter
                            </li>
                            <li style="display: flex; align-items: center; margin: 8px 0;">
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Probate Letter
                            </li>
                            <li style="display: flex; align-items: center; margin: 8px 0;">
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Honor Previous Offer Letter
                            </li>
                          </ul>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5018 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Julia Lees <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> The deed received letter has two $$ dollar signs for both draft amounts.  Also, need to change Cyndi's last name from Bryant to Price.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5019 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Lori Hauge <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> The Highlight feature does not appear to be working in the individual contacts.  It is working in the "Notes", but not when trying to highlight something in one of the Fields within a Contact.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">3.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5022 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> We need to be able to put in dates of birth and death using zeros (when needed) for information we don't have.  Our sources will give the month and year of death but not the actual day of the month a person died on.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.6',
    release_date: 'January 7, 2025',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5001 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> The deed still says 2024 (I think this is fixed).
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> When I assign a task to someone and go back into the file, it does not say the person’s name I assigned the task to - It is saying BuyerAsst Department.  Are they separating Brooklyn & Tina’s task or what?   The old FM used to automatically assign the task to the correct followup person, Steve’s got   assigned to Tina, Aaron’s got assigned to Brooklyn.  Can we change it so that it does that now?
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> On the TX offers, in the deed, if there is a legal like this:  PSL Survey, T2S, … - It is spelling out the word Township & South.  On TX deeds, we like it to be the shorter version - T2S.  On OK offers, it needs to be spelled out.
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> If there is more than 1 county listed on the deed & offer, it used to change the COUNTY to COUNTIES.  Can we fix that. (the last few offers have been correct)
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> It is still putting an extra space between the person's name & the colon (Example:   DEAR MR. SMITH :
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> It is still putting an extra dollar sign on the offer in 2 places
                              </span>                              
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4988 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> It is putting an extra dollar sign in the offers
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">3.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4999 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tina Lewis <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I can only see one line of notes at a time when entering a note in the task. Many times I am entering long notes and need to see the whole note. In the past we could see the whole note before saving to review it. It would be very helpful to see it all without having to scroll up and down each time.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">4.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5002 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tina Lewis <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> If I have an existing task that is assigned to me and I delete a note in the task that is no longer needed and update the task. After updating the task it still saves the note I deleted from it.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">5.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5003 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Seth Hurley <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Offer can’t be sent to the queue because the ‘Grantors’ field exceeds 255 characters
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">6.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-5008 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> This is my first offer of the day.  I opened the deed and it looks like this (what I have attached).  All the counties in bold are all in caps (which they should not be).  Not sure why it isn't putting the legals in?
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.5',
    release_date: 'December 24, 2024',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4983 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> When I do an offer and push complete, when it makes the note, it is not putting the dollar sign or comma in the amounts.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.4',
    release_date: 'December 23, 2024',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4891 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> When I go in to do offers, I have to stretch the FM app almost to the size of my computer screen to see everything.  It would be nice to see everything on the same page without having to make it huge?  I have to open several documents at the same time and like to see other things as well.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4974 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I just did a search for the Empire Resources file so I could pay Kathleen Irish.  There are two deeds in on this file and Monique Shalimar should be the "Main" but that is not reflected on this screen.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.3',
    release_date: 'December 20, 2024',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4909 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I need to be able to add notes to division orders even if all of the 1st, 2nd & 3rd notice fields are not completed.  I can't seem to do that.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4971 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Can we please make it so we are not required to fill in all date fields before we can save information added to a file.  Date fields that are not filled in have an X next to the calendar icon and I have to click the X on all empty date fields before I can save to a file.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.2',
    release_date: 'December 19, 2024',
    sections: [
      {
        title: {
          name: "What's New",
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                            <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">1.</span>Main option is introduced in Contacts.
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                            <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">2.</span> Document Type field is introduced in Recording.
                                </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                            <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">3.</span> Taxing Entity is introduced in Taxes.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                            <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">4.</span>Created Date is displayed for all Tasks.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4950 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I just did an offer and when I hit complete, I noticed on the note it saved - it is saving the 1st draft instead of the 2nd draft amount.  So it says offer was sent for $150 instead of the actual purchase amount.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4923 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I do not like how the downloads work.  On the old one you just hit the download offer/deed button and it just downloaded it to the computer.  Now it downloads to the Documents tab, then you have to open that, then that opens on FM and then you have to download it again.  Lots of steps.  It should just download to the computer like it used to.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">3.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4918 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I am in the Empire Resources file and am trying to add the recording information for the Monique Shalimar Ames deed.  All recording is put into the MAIN filed so there are several entries that are made.  In the past I was able to add what document is being recorded in the "County" line - i.e  Kingfisher (Deed-Monique Shalimar Ames).  Now I am forced to find the county on a drop down menu and I cannot ad additional information to that line.  This will cause a nightmare when trying to recall documents as there is no way to label the different entries. 
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">4.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4917 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> The system will not 
allow me to add "Main" to the county line in new entries.  I must
be able to quickly distinguish the "Main" file that has all the 
information in it.  I am in the Empire Resources file.  Monique's
deed was the first to arrive and should be marked "Main".  
Kathleen Irish's deed is new but I won't remember which one has 
all the info in it a week or month from now.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">5.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4916 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> The prompt I get when I 
try to save a downloaded doc to my desktop says:  "You are trying
to perform an action you do not have rights for.  Please contact 
your Document Server".  I need to have these rights to all 
documents in docs.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                        <li style="display: flex; margin: 8px 0;">
                          <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.0rem;
                                margin-top: 5px;
                              ">6.</span>
                          <span style="text-align: justify;">
                            Bug Report FM-4915 Fixed <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> Cyndi Price <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> I am constantly downloading documents from docs and saving them to my desktop so I can attach them to emails or record online etc. I am trying to do this right now and it seems very complicated. Can't I just open the doc and save to my desktop like I could before?
                          </span>
                        </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                        <li style="display: flex; margin: 8px 0;">
                          <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.0rem;
                                margin-top: 5px;
                              ">7.</span>
                          <span style="text-align: justify;">
                            Bug Report FM-4913 Fixed <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> Tamara Maxwell <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> Second request to address being able to update contact addresses. I am able to go into contact and change home address/city/state/zip and hit "save" at the bottom of the page however, when I go back into the main file to resend, I notice the address is not saving/updating. It's reverting back to the old address already in the file. This is urgent as we need to get these returns right back out.
                          </span>
                        </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                        <li style="display: flex; margin: 8px 0;">
                          <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.0rem;
                                margin-top: 5px;
                              ">8.</span>
                          <span style="text-align: justify;">
                            Bug Report FM-4906 Fixed <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> Tamara Maxwell <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> I am able to go into contact and change address/city/state/zip and hit "save", however, when I go back into the file after updating the address, it doesn't save the new address.
                          </span>
                        </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                        <li style="display: flex; margin: 8px 0;">
                          <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.0rem;
                                margin-top: 5px;
                              ">9.</span>
                          <span style="text-align: justify;">
                            Bug Report FM-4899 Fixed <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> Cyndi Price <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> It doesn’t appear the system likes the word *MAIN* in the “County” box in Deed View. I am looking at the Fred G Payne file and have selected the Jeffrey Stewart Payne deed. Please view the big red note underneath that area. When a file comes in with multiple deeds I select one “Main” file to put all the info into so I don’t have to do all that duplicating for each deed file.
                          </span>
                        </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                        <li style="display: flex; margin: 8px 0;">
                          <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.0rem;
                                margin-top: 5px;
                              ">10.</span>
                          <span style="text-align: justify;">
                            Bug Report FM-4901 Fixed <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> Cyndi Price <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> I am in the Harry W Nelson Jr file and have added some suspense from Diamondback. The tab key no longer works to move from date to date - now you have to click in each box and add date - this is inconvenient.
                          </span>
                        </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                        <li style="display: flex; margin: 8px 0;">
                          <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.0rem;
                                margin-top: 5px;
                              ">11.</span>
                          <span style="text-align: justify;">
                            Bug Report FM-4912 Fixed <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> Monica Brooks <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> When we get a deed in and record it under the RECORDING tab, it does not show what has been recorded. It used to show what we sent (Deed, AOH, Disclaimer, etc.)
                          </span>
                        </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                        <li style="display: flex; margin: 8px 0;">
                          <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.0rem;
                                margin-top: 5px;
                              ">12.</span>
                          <span style="text-align: justify;">
                            Bug Report FM-4919 Fixed <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> Lori Hauge <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> This feature used to update at 8 am daily. Of course, anyone could send us a task during the day and we would see it. However, for future tasks that are set up by the follow-up crew, they seem to be updating frequently instead of all coming in at once. It's not a huge deal, but can be a little confusing for Research.
                          </span>
                        </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                        <li style="display: flex; margin: 8px 0;">
                          <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.0rem;
                                margin-top: 5px;
                              ">13.</span>
                          <span style="text-align: justify;">
                            Bug Report FM-4922 Fixed <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> Monica Brooks <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> The deed is still not downloading correctly. I have highlighted what needs to be changed. There are 4 places in the body of the deed that have the counties. It should not be in all CAPS. The only one that should be in caps is the last one right before the signature line. All the rest should be just regular small font. And now it appears if there is more than 1 county listed, it is putting a comma also.
                          </span>
                        </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                        <li style="display: flex; margin: 8px 0;">
                          <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.0rem;
                                margin-top: 5px;
                              ">14.</span>
                          <span style="text-align: justify;">
                            Bug Report FM-4921 Fixed <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> Lori Hauge <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> Just noticed that our highlighting "code" that we use doesn't appear to be working - at least on the face of the main file page. Unclear if it's working in notes. We typically use this: <mark>then to close</mark>.
                          </span>
                        </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0; margin-left: 10px">
                        <li style="display: flex; margin: 8px 0;">
                          <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.0rem;
                                margin-top: 5px;
                              ">15.</span>
                          <span style="text-align: justify;">
                            Bug Report FM-4919 Fixed <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> Lori Hauge <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> This feature used to update at 8am daily.  Of course anyone could send us a task during the day and we would see it.  However, for future tasks that are set up by the follow-up crew, they seem to be updating frequently instead of all coming in at once.  It's not a huge deal, but can be a little confusing for Research.
                          <span style="text-align: justify;">
                             <span style="
                            display: inline-flex;
                            justify-content: center;
                            align-items: start;
                            margin-right: 5px;
                            margin-left: 5px;
                            font-weight: bold;
                            font-size: 1.3rem;
                          ">•</span> Fixed by #4 in What's New section.
                          </span>
                        </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.1',
    release_date: 'December 18, 2024',
    sections: [
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">1.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4920 Fixed <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Lori Hauge <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> This has become an Urgent Issue.  At this time Tamara and I (Research Dept) are unable to complete each others Tasks.  The majority of the tasks assigned to research are set up as a default to me (Lori).  Tamara is not able to complete any of the tasks assigned to me.  I will be out of the office for 2 weeks starting tomorrow and so it's urgent to get this fixed so she can complete any tasks assigned to me.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">2.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4914 Fixed 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Brooklyn Paz <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> On the file info, it shows DOB's for contacts, but when you click the contact the dates are not there. it shows MM/DD/YYYY. also, when I want to modify details in the contact info, for instance if I want to change a phone number from "home" to "bad" because its no longer in service, I typically change it and then save the contact. well it won't let me save the contact because there is no DOB. it says in red "please select valid date" for the DOB field and the DOD field. well with no date showing in the contact initially, I press the X (for both DOB and DOD) and then it lets me save the contact. but I didnt realize this was deleting the DOBs from the file info. so now there are some missing and I dont know what they were before.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">3.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4910 Fixed 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Bella Stoffel <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> It will not let me change the paper location, the check box for if a paper file exists or the "as of"  date.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">4.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4908 Fixed
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Julia Lees <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Please make the default sort order for all notes be descending order based on the Date Completed field.  This would apply to editfile, editcontact, and editdeed.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">5.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4907 Fixed
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tamara Maxwell <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Documents within files are not alphabetically listed/grouped together. They are scattered.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">6.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4905 Fixed 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I added a ticket about deed notes not adding but it appears they do - just at the bottom of the note list and not at the top.  Please make is to the most recent notes are added to the top.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">7.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4904 Fixed 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Lori Hauge <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> When on main file page, birth/death dates show up.  They are not showing up in each individual contact.  
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">8.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4903 Fixed 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I just added a couple deed notes to the James E Carlson file.  I initially didn't think they added but then noticed new notes are added to the bottom of the list of notes.  Can we change that so most recent notes are at the top? 
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">9.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4897 Fixed
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Lori Hauge <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> When viewing notes in a file, they appear in date order - with the original first note at the top.  It would be easier to see the most recent note at the top (descending) so we don't have to scroll so much since some files have numerous notes.  
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">10.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4895 Fixed 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Brooklyn Paz <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> On the file info, when looking at the contacts, I've noticed some files not showing any offer dates, it's just zeros, and others not having the updated dates. 
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">11.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4894 Fixed 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Lori Hauge <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Noticed several files on my Task list that are showing an error in the file value - just on the task screen.  Example: Elson, Gina - not sure my screen shot is attaching properly.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">12.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4893 Fixed
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tamara Maxwell <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Would it be possible to remove the filter box from popping up to the left of my screen everytime I open a file? 
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">13.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4890 Fixed 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Lori Hauge <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> In the Bertha Porter file - I noticed the last offer sent was showing as 12/2020, however, the last offer actually sent was in 2024.  We need to make sure on the face of the file this field reflects the most current offer sent.  
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">14.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4889 Fixed 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> When doing an offer, when I hit the OFFER/DEED button for it to download the docs, it downloads them onto FM first then I have to go download them again.  That seems a little redundant. 
                                         Also, I opened the downloaded deed:
                              </span>
                            </li>
                            <ul style="list-style: none; padding: 0; margin-left: 30px;">
                            <li style="display: flex; align-items: center; margin: 8px 0;">
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> The County is all in Caps at the top, the 2 inside the deed and then the 4th county isn't even there.  The 4th County should all be CAPS.
                            </li>
                            <li style="display: flex; align-items: center; margin: 8px 0;">
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> It is adding the county in the legal description area (which it is not supposed to).
                            </li>
                          </ul>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">15.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4886 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Lori Hauge <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> As of Friday 12/13 the Ready for Offer queue had 94 files in it.  Currently showing no files.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">16.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4899 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> It doesn’t appear the system likes the word*MAIN* in the “County” box in Deed View.  I am looking at the Fred G Payne file and have selected the Jeffrey Stewart Payne deed.  Please view the big red note underneath that area.  When a file comes in with multiple deeds I select one “Main” file to put all the info into so I don’t have to do all that duplicating for each deed file.
                              </span>
                            </li>
                            <li style="display: flex; margin: 8px 0; margin-left: 35px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">
                                Update from Cyndi via Slack ”I also need to make an updated note about the “County” field.  It is not just the word “MAIN” it doesn’t like.  I get the big red note each time there are multiple words in the field.  Many times we but from an individual in several different states and or counties and we have always listed them all together in that one field.”
                                </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">17.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4906 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tamara Maxwell <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I am able to go into contact and change address/city/state/zip and hit "save" however, when I go back into file after updating address, it doesn't save the new address.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">18.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4911 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I am trying to open and view my family tree in docs in the C B Strom file and keep getting an error message so there is no way for me to view and update the tree.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">19.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4913 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Tamara Maxwell <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Second request to address being able to update contact addresses. I am able to go into contact and change home address/city/state/zip and hit "save" at bottom of page however, when I go back into main file to resend, I notice address is not saving/updating. It's reverting back to the old address already in file. This is urgent as we need to get these returns right back out.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">20.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4915 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I am constantly downloading documents from docs and saving them to my desktop so I can attach them to emails or record on-line etc......I am trying to do this right now and it seems very complicated.  Can't I just open the doc and save to my desktop like I could before?
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">21.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4916 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> The prompt I get when I try to save a downloaded doc to my desktop says:  "You are trying to perform an action you do not have rights for.  Please contact your Document Server".  I need to have these rights to all documents in docs.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">22.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4917 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> The system will not allow me to add "Main" to the county line in new entries.  I must be able to quickly distinguish the "Main" file that has all the information in it.  I am in the Empire Resources file.  Monique's deed was the first to arrive and should be marked "Main".  Kathleen Irish's deed is new but I won't remember which one has all the info in it a week or month from now.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">23.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4918 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Cyndi Price <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I am in the Empire Resources file and am trying to add the recording information for the Monique Shalimar Ames deed.  All recording is put into the MAIN filed so there are several entries that are made.  In the past I was able to add what document is being recorded in the "County" line - i.e  Kingfisher (Deed-Monique Shalimar Ames).  Now I am forced to find the county on a drop down menu and I cannot ad additional information to that line.  This will cause a nightmare when trying to recall documents as there is no way to label the different entries.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">24.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4923 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I do not like how the downloads work.  On the old one you just hit the download offer/deed button and it just downloaded it to the computer.  Now it downloads to the Documents tab, then you have to open that, then that opens on FM and then you have to download it again.  Lots of steps.  It should just download to the computer like it used to.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                  margin-top: 5px;
                                ">25.</span>
                                <span style="text-align: justify;">
                                Bug Report FM-4950 
                                <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Monica Brooks <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: start;
                                margin-right: 5px;
                                margin-left: 5px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> I just did an offer and when I hit complete, I noticed on the note it saved - it is saving the 1st draft instead of the 2nd draft amount.  So it says offer was sent for $150 instead of the actual purchase amount.
                              </span>
                            </li>
                      </ul>`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
  {
    version: '2.0.0',
    release_date: 'December 15, 2024',
    sections: [
      {
        title: {
          name: "What's New",
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0;">
                            <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">1.</span>
                                <span>A new <b>“Document Editor”</b> feature has been added, enabling users to view, edit, and print uploaded documents directly within the platform.  
                                  This function enhances document management and streamlines workflows by allowing users to make necessary changes to their documents without needing 
                                  to download or use third-party editing tools.
                                  </span>
                            </li>
                            <li style="margin-bottom: 10px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">2.</span>
                                <span>
                                A "Documents" menu has been added in the Nav Bar to pick and view newly generated documents.
                            </span>
                            </li>
                            <li style="margin-bottom: 10px;">
                            <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">3.</span>
                                <span>
                                In the mobile version, the <b>“Document Editor”</b> feature will only be available for viewing purposes only.
                            </span>

                            </li>
                      </ul>`,
            type: 'video',
            src: '/assets/rel-2.0-docs-function.mp4',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">4.</span>
                                <span>A new <b>“Notification”</b> feature, has been introduced to alert 
                                users when a generated document is successfully created. This feature 
                                has been implemented for the following document links
                              </span>
                            </li>
                              
                          <ul style="list-style: none; padding: 0; margin-left: 30px;">
                            <li style="display: flex; align-items: center; margin: 8px 0;">
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Request Letter
                            </li>
                            <li style="display: flex; align-items: center; margin: 8px 0;">
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Offer Letter
                            </li>
                            <li style="display: flex; align-items: center; margin: 8px 0;">
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Deed Received Letter
                            </li>
                          </ul>
                      </ul>`,
            type: 'video',
            src: '/assets/rel-2.0-notification.mp4',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">5.</span>
                                <span>A new <b>“Search Filter”</b> feature has been added to allow 
                                users to easily search for files by applying various filters, 
                                making it quicker and simpler to locate specific documents. 
                                This feature has been added for the following action buttons.
                              </span>
                            </li>
                        <ul style="list-style: none; padding: 0; margin-left: 30px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>My Task

                    </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Request to send
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Offer to send
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Unreceived Requests   
                                                    </li>
                                                                              <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Deeds pending
                                                    </li>
                                                                              <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Checked Out

                                                    </li>
                                                                              <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Offers to send

                                                    </li>
                                                                              <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Ready for offer

                                                    </li>
                                                                              <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>File Review

                                                    </li>
                                                                              <li style="display: flex; align-items: center; margin: 8px 0;">
                           <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Urgent Tasks

                                                    </li>
                                                                              <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Request letter

                                                    </li>
                                                                              <li style="display: flex; align-items: center; margin: 8px 0;">
                           <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>TeamMate Task

                                                    </li>
                                                                              <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>RequestBefore21days

                                                    </li>
                                                                              <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Ready for offer
                                                </li>
                                                </ul>
                        </ul>`,
            type: 'video',
            src: '/assets/rel-2.0-dashboard-action-search-filter.mp4',
          },
        ],
      },
      {
        title: {
          name: 'Improvements',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">1.</span>
                                <span>A Snackbar will appear on each page after successfully creating or updating a record, as well as when the creation or update fails.
                              </span>
                            </li>
                        </ul>
            `,
            type: 'image',
            src: '/assets/rel-2.0-snackbar.png',
          },
          {
            content: `
            <ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">2.</span>
                                <span>User input validation is handled for all the pages.
                              </span>
                            </li>
                        </ul>
                        `,
            type: 'image',
            src: '/assets/rel-2.0-field-validation.png',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">3.</span>
                                <span>The <b>"State"</b> field, has been changed from an input text field to a dropdown     select field.
                              </span>
                            </li>
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">4.</span>
                                <span>The <b>"State"</b> field will allow users to select multiple states.
                              </span>
                            </li>
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">5.</span>
                                <span>These changes have been added to the following pages:
                              </span>
                            </li>
                                                    <ul style="list-style: none; padding: 0; margin-left: 30px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Create New File Page

                                                    </li>
                                                    <li style="display: flex; align-items: center; margin: 8px 0;">
                                                      <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Edit File Page
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span> Edit Deed Page
                          </li>
                          </ul>
                        </ul>
                      `,
            type: 'image',
            src: '/assets/rel-2.0-state-dropdown.png',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">6.</span>
                                <span>
                      The <b>"County"</b> field, has been changed from an input text field to a dropdown select field.
                      The <b>"County"</b> field now allows users to select multiple counties.
                      The <b>"County"</b> field will display values based on the selected state.
                      These changes have been added to the following pages
                              </span>
                            </li>

                      <ul style="list-style: none; padding: 0; margin-left: 30px;">
                        <li style="display: flex; align-items: center; margin: 8px 0;">
                          <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Create New File Page

                                                    </li>
                                                    <li style="display: flex; align-items: center; margin: 8px 0;">
                                                      <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Edit File Page
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Edit Deed Page
                          </li>
                                                    <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Create New Tax Page
                          </li>
                                                    <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Edit Tax Page
                          </li>
                                                                           <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Create New Court Address Page
                          </li>
                                                    <li style="display: flex; align-items: center; margin: 8px 0;">
                           <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Edit Court Address Page
                          </li>
                                                                           <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Create New Legal Page
                          </li>
                                                    <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Edit Legal Page
                          </li>
                                                                           <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Add Division Order Page
                          </li>
                                                    <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Add Recording Page
                          </li>
                                                                              <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Edit Recording Page
                          </li>
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Add Well Master Page
                          </li>
                                                    <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Edit Well Master Page
                          </li>
                                                    <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Add Well Page
                          </li>
                                                    <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>Edit Well Page
                          </li>
                        </ul>
                      `,
            type: 'image',
            src: '/assets/rel-2.0-county-dropdown.png',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">7.</span>
                                <span>In the previous version of the <b>'Ask Research'</b> page, the priority field was not available. In the current version, the priority field has been newly added, and users are unable to create a research task without selecting a priority.
                              </span>
                            </li>
                      </ul>
                      `,
            type: 'image',
            src: '/assets/rel-2.0-ask-research.png',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">8.</span>
                                <span>In the previous version, if the user selected the <b>"stay logged in"</b> option 
                      during login, the application would not auto log out. In the current version, 
                      the application will automatically log out after 72 hours of 
                      inactivity.
                              </span>
                            </li>
                      </ul>
                      `,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">9.</span>
                                <span>In the previous version, the mobile version was not responsive for the UI. In the current version, the UI is now responsive for mobile devices.
                              </span>
                            </li>
                      </ul>
            `,
            type: 'text',
            src: '',
          },
          {
            content: `
            <ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">10.</span>
                                <span><b>In MyTask</b> -  modify the hardcoded user ID to reference the Buyer Research department, allowing users within the Buyer Research department to view tasks assigned to any other users in the same department, as well as their own tasks. For all other users, the query should return only the tasks assigned to their specific user ID.
                              </span>
                            </li>
                      </ul>
            `,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">11.</span>
                                <span><b>In Urgent task</b> -  Change the hardcoded userid to Buyer Research department So Buyer Research department user can see the tasks assigned to any of the other Buyer Research department users and to him. And for every other user, the query just shows tasks assigned only to their own userid.
                              </span>
                            </li>
                      </ul>
                      `,
            type: 'text',
            src: '',
          },

          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">12.</span>
                                <span><b>Research Task</b> -  In the previous version, the research task was assigned specifically to Lori Hauge, whereas in the current version, it is now available to any user within the Buyer Research department.
                              </span>
                            </li>
                      </ul>
                      `,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">13.</span>
                                <span>Edit Task via File,Contact and Deed is now department-specific:
                              </span>
                            </li>
                        <ul style="list-style: none; padding: 0; margin-left: 40px;">
                          <li style="display: flex; align-items: center; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>
                                        <span>Users with the 'BuyerResearch' role can edit tasks within their department where the 'touserid' role is 'Buyer' or 'BuyerAsst'.</span>
                          </li>
                          <li style="display: flex; align-items: self-start; margin: 8px 0;">
                              <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>
                              <span>Users with the 'BuyerAsst' role can edit tasks within their department where the 'touserid' role is 'Buyer' or 'BuyerResearch'.</span>
                          </li>
                          <li style="display: flex; align-items: self-start; margin: 8px 0;">
                            <span style="
                                display: inline-flex;
                                justify-content: center;
                                align-items: center;
                                margin-right: 15px;
                                font-weight: bold;
                                font-size: 1.3rem;
                              ">•</span>
                              <span>Users with the 'Buyer' role can edit all tasks.</span>
                          </li>
                        </ul>
                        </ul>`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">14.</span>
                                <span>After completing an offer, the <b>'Offer Follow-Up'</b> task will be assigned to both the Buyer Assistant department and the selected user ID.
                              </span>
                            </li>
                      </ul>
            `,
            type: 'text',
            src: '',
          },
        ],
      },
      {
        title: {
          name: 'Bug Fixes',
          sx: 'header1',
        },
        details: [
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">1.</span>
                                <span>In the previous version, when the "Request to send" dashboard action was selected, it did not fetch any data and displayed the message "Could not query the database at this time." In the current version, it now fetches all relevant details, and the list of requests is displayed on the <b>"Request to Send Details"</b> page.
                              </span>
                            </li>
                      </ul>
                      `,
            type: 'image',
            src: '/assets/rel-2.0-request-to-send-dashboard.png',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">2.</span>
                                <span>In the previous version, users could create and edit tasks without specifying a task type. In the current version, users are not allowed to save a task without selecting a task type. 
                              </span>
                            </li>
                      </ul>
                      `,
            type: 'image',
            src: '/assets/rel-2.0-make-task.png',
          },

          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">3.</span>
                                <span>In the previous version, the Create and Edit Tax pages, 
                                did not have an option to select state details. 
                                In current version, the state field has been added to 
                                the Create and Edit pages, and the state field is now mandatory for users to select.
                              </span>
                            </li>
                      </ul>
                      `,
            type: 'image',
            src: '/assets/rel-2.0-new-tax-creation.png',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">4.</span>
                                <span>In the previous version of the Create and Edit Court page, users could add new court records without including state details. However, In the current version, state details are now mandatory, and users cannot add new court records without them.
                              </span>
                            </li>
                      </ul>
            
`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">5.</span>
                                <span>In the previous version, on the Make Offer page, when selecting a different buyer and clicking 'Send Offers to Queue', the buyer was not updated in the file view or edit offer section. In the current version, the selected buyer is now reflected in both the file view and edit offer sections after saving.
                              </span>
                            </li>
                      </ul>
            `,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">6.</span>
                                <span>            In the previous version, after creating or copying a well, the Division Order count would increase based on the well count in the Division Order table. In the current version, the count will no longer increase in the Division Order table.

                              </span>
                            </li>
                      </ul>
`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">7.</span>
                                <span>            In the current version, if the file status is "Dead" and the task type is "Dead File," it can no longer be updated, deleted, or completed. Actions on such tasks are now restricted to ensure they cannot be modified.

                              </span>
                            </li>
                      </ul>
`,
            type: 'text',
            src: '',
          },
          {
            content: `<ul style="list-style: none; padding: 0;">
                          <li style="display: flex; margin: 8px 0;">
                             <span style="
                                  display: inline-flex;
                                  justify-content: center;
                                  align-items: start;
                                  margin-right: 15px;
                                  font-weight: bold;
                                  font-size: 1.0rem;
                                ">8.</span>
                                <span>            In the current version, the check request task can only be updated for the following departments: Accounting, Division Order, and Buyer Department.

                              </span>
                            </li>
                      </ul>
`,
            type: 'text',
            src: '',
          },
        ],
      },
    ],
  },
];

export default releaseV1;
